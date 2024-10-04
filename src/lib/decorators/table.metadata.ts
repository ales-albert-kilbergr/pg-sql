/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/ban-types */
import { Metadata } from '@kilbergr/metadata';
import * as Pg from '../model';

export interface ColumnDecoratorCommonArgs {
  columnName?: string;
  propertyKey: string;
  comment?: string;
}

export type ColumnDecoratorArgs<D extends Pg.DataTypeDiscriminant> = D extends
  | Pg.DataTypeDiscriminant.VARCHAR
  | Pg.DataTypeDiscriminant.CHAR
  ? Pg.WithLengthDataTypeArgs
  : object;

export const metadata = new Metadata<TableMetadata>('pg:table');

export class TableMetadata {
  public table?: Pg.Table;

  private deferredTableCalls: ((table: Pg.Table) => void)[] = [];

  private readonly deferredColumnCalls = new Map<
    string,
    ((column: Pg.Column) => void)[]
  >();

  public static getMetadata(target: Function): TableMetadata {
    // We don't know in which order the decorators will be applied, so we need to
    // need to create a table model for the target if it doesn't exist yet.
    // If the decorator will be applied before the @Table decorator, we cannot
    // know what table, schema name to use.
    if (!metadata.has(target)) {
      metadata.set(target, new TableMetadata());
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return metadata.get(target)!;
  }

  public defineTable(name: string): void {
    const nameParts: string[] = name.split('.');

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (nameParts.length > 3) {
      throw new TypeError(
        `Invalid table name: ${name}. Table name can only have 3 parts at most.`,
      );
    }

    const databaseName: string =
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      nameParts.length === 3
        ? (nameParts.shift() ?? Pg.Database.DEFAULT_NAME)
        : Pg.Database.DEFAULT_NAME;

    const schemaName =
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      nameParts.length === 2
        ? (nameParts.shift() ?? Pg.Schema.DEFAULT_NAME)
        : Pg.Schema.DEFAULT_NAME;

    const tableName = nameParts.shift();

    const database: Pg.Database = Pg.databases.has(databaseName)
      ? Pg.databases.get(databaseName)!
      : Pg.defineDatabase(databaseName);

    const schema: Pg.Schema = database.schemas.has(schemaName)
      ? database.schemas.get(schemaName)!
      : database.defineSchema(schemaName);

    const table = schema.defineTable(tableName!);

    this.table = table;

    // Run deferred calls
    for (const callback of this.deferredTableCalls) {
      callback(table);
    }

    this.deferredTableCalls = [];
  }

  public definePrimaryKey(
    args: Pg.TablePrimaryKeyConstraintArgs,
    primaryKeyName?: string,
  ): void {
    this.whenTableSet((table) => {
      table.definePrimaryKey(primaryKeyName ?? `${table.name}_pkey`, args);
    });
  }

  public defineUniqueKey(
    args: Pg.TableUniqueConstraintArgs,
    uniqueKeyName?: string,
  ): void {
    this.whenTableSet((table) => {
      const constraintName =
        uniqueKeyName ?? `${table.name}_${args.columns.join('_')}_key`;

      table.defineUniqueKey(constraintName, args);
    });
  }

  public defineColumn(
    dataTypeDiscriminant: Pg.DataTypeDiscriminant,
    {
      columnName,
      propertyKey,
      comment,
      ...dataTypeArgs
    }: ColumnDecoratorCommonArgs & (Pg.WithLengthDataTypeArgs | object),
  ): void {
    this.whenTableSet((table) => {
      const { database } = table.schema;

      // eslint-disable-next-line @typescript-eslint/init-declarations, @typescript-eslint/no-explicit-any
      let dataType: Pg.DataType<any, any>;

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
          dataType = database.dataTypes.getVarchar(
            dataTypeArgs as Pg.WithLengthDataTypeArgs,
          );
          break;
        case Pg.DataTypeDiscriminant.CHAR:
          dataType = database.dataTypes.getChar(
            dataTypeArgs as Pg.WithLengthDataTypeArgs,
          );
          break;
        case Pg.DataTypeDiscriminant.TIMESTAMPTZ:
          dataType = database.dataTypes.getTimestamptz();
          break;
        default:
          throw new TypeError(
            `Invalid data type discriminant: ${dataTypeDiscriminant}`,
          );
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

  public defineCreatedAtColumn(propertyKey: string): void {
    this.whenTableSet((table) => {
      table.defineCreatedAtColumn(propertyKey);
    });
  }

  public defineUpdatedAtColumn(propertyKey: string): void {
    this.whenTableSet((table) => {
      table.defineUpdatedAtColumn(propertyKey);
    });
  }

  public defineNullable(propertyKey: string): void {
    this.whenColumnSet(propertyKey, (column) => {
      column.defineNull();
    });
  }

  public defineDefault(propertyKey: string, defaultExpression: string): void {
    this.whenColumnSet(propertyKey, (column) => {
      column.defineDefault({
        expression: defaultExpression,
      });
    });
  }

  public whenTableSet(callback: (table: Pg.Table) => void): void {
    if (this.table) {
      callback(this.table);
    } else {
      this.deferredTableCalls.push(callback);
    }
  }

  public whenColumnSet(
    propertyKey: string,
    callback: (column: Pg.Column) => void,
  ): void {
    if (this.table?.columns.has(propertyKey)) {
      callback(this.table.columns.getByPropertyKey(propertyKey)!);
    } else {
      const callbacks = this.deferredColumnCalls.get(propertyKey) ?? [];
      callbacks.push(callback);
      this.deferredColumnCalls.set(propertyKey, callbacks);
    }
  }
}
/**
 * This is a public method that returns the table metadata.
 *
 * @param target
 * @returns
 */
export function getTableMetadata(target: Function): TableMetadata | undefined {
  return metadata.get(target);
}
