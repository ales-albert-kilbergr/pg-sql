import { Metadata } from '@kilbergr/metadata';
import * as Pg from '../../src/lib/model';
export const metadata = new Metadata('pg:table');
export class TableMetadata {
    table;
    deferredTableCalls = [];
    deferredColumnCalls = new Map();
    static getMetadata(target) {
        if (!metadata.has(target)) {
            metadata.set(target, new TableMetadata());
        }
        return metadata.get(target);
    }
    defineTable(name) {
        const nameParts = name.split('.');
        if (nameParts.length > 3) {
            throw new TypeError(`Invalid table name: ${name}. Table name can only have 3 parts at most.`);
        }
        const databaseName = nameParts.length === 3
            ? (nameParts.shift() ?? Pg.Database.DEFAULT_NAME)
            : Pg.Database.DEFAULT_NAME;
        const schemaName = nameParts.length === 2
            ? (nameParts.shift() ?? Pg.Schema.DEFAULT_NAME)
            : Pg.Schema.DEFAULT_NAME;
        const tableName = nameParts.shift();
        const database = Pg.databases.has(databaseName)
            ? Pg.databases.get(databaseName)
            : Pg.defineDatabase(databaseName);
        const schema = database.schemas.has(schemaName)
            ? database.schemas.get(schemaName)
            : database.defineSchema(schemaName);
        const table = schema.defineTable(tableName);
        this.table = table;
        for (const callback of this.deferredTableCalls) {
            callback(table);
        }
        this.deferredTableCalls = [];
    }
    definePrimaryKey(args, primaryKeyName) {
        this.whenTableSet((table) => {
            table.definePrimaryKey(primaryKeyName ?? `${table.name}_pkey`, args);
        });
    }
    defineUniqueKey(args, uniqueKeyName) {
        this.whenTableSet((table) => {
            const constraintName = uniqueKeyName ?? `${table.name}_${args.columns.join('_')}_key`;
            table.defineUniqueKey(constraintName, args);
        });
    }
    defineColumn(dataTypeDiscriminant, { columnName, propertyKey, comment, ...dataTypeArgs }) {
        this.whenTableSet((table) => {
            const { database } = table.schema;
            let dataType;
            switch (dataTypeDiscriminant) {
                case Pg.DataTypeDiscriminant.BIGINT:
                    dataType = database.dataTypes.getBigInt();
                    break;
                case Pg.DataTypeDiscriminant.INTEGER:
                    dataType = database.dataTypes.getInt();
                    break;
                case Pg.DataTypeDiscriminant.SMALLINT:
                    dataType = database.dataTypes.getSmallInt();
                    break;
                case Pg.DataTypeDiscriminant.TEXT:
                    dataType = database.dataTypes.getText();
                    break;
                case Pg.DataTypeDiscriminant.VARCHAR:
                    dataType = database.dataTypes.getVarchar(dataTypeArgs);
                    break;
                case Pg.DataTypeDiscriminant.CHAR:
                    dataType = database.dataTypes.getChar(dataTypeArgs);
                    break;
                case Pg.DataTypeDiscriminant.TIMESTAMPTZ:
                    dataType = database.dataTypes.getTimestamptz();
                    break;
                default:
                    throw new TypeError(`Invalid data type discriminant: ${dataTypeDiscriminant}`);
            }
            const column = table.defineColumn(dataType, columnName ?? propertyKey);
            column.propertyKey = propertyKey;
            column.comment = comment;
            const deferredCalls = this.deferredColumnCalls.get(propertyKey) ?? [];
            for (const callback of deferredCalls) {
                callback(column);
            }
        });
    }
    defineCreatedAtColumn(propertyKey) {
        this.whenTableSet((table) => {
            table.defineCreatedAtColumn(propertyKey);
        });
    }
    defineUpdatedAtColumn(propertyKey) {
        this.whenTableSet((table) => {
            table.defineUpdatedAtColumn(propertyKey);
        });
    }
    defineNullable(propertyKey) {
        this.whenColumnSet(propertyKey, (column) => {
            column.defineNull();
        });
    }
    defineDefault(propertyKey, defaultExpression) {
        this.whenColumnSet(propertyKey, (column) => {
            column.defineDefault({
                expression: defaultExpression,
            });
        });
    }
    whenTableSet(callback) {
        if (this.table) {
            callback(this.table);
        }
        else {
            this.deferredTableCalls.push(callback);
        }
    }
    whenColumnSet(propertyKey, callback) {
        if (this.table?.columns.has(propertyKey)) {
            callback(this.table.columns.getByPropertyKey(propertyKey));
        }
        else {
            const callbacks = this.deferredColumnCalls.get(propertyKey) ?? [];
            callbacks.push(callback);
            this.deferredColumnCalls.set(propertyKey, callbacks);
        }
    }
}
export function getTableMetadata(target) {
    return metadata.get(target);
}
//# sourceMappingURL=table.metadata.js.map