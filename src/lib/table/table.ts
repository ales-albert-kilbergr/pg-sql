/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnList, type ColumnName } from '../column';
import { Column } from '../column';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import { DatabaseObject, DatabaseObjectList } from '../database-object';
import type { Database } from '../database';
import type { Schema } from '../schema';
import {
  type TableCheckConstraintArgs,
  TableConstraint,
  TableConstraintDiscriminant,
  type TableForeignKeyConstraintArgs,
  type TablePrimaryKeyConstraintArgs,
  type TableUniqueConstraintArgs,
  type TableConstraintName,
} from './table-constraint';
import {
  TablePartitionStrategy,
  type TablePartitionType,
  type TablePartitionKey,
  type TablePartitionNameBuilder,
} from './table-partition';
import type { TableName } from './table.types';
import {
  CreateTablePartitionSql,
  CreateTableSql,
  DropTableSql,
  InsertIntoTableSql,
  TableExistsSql,
} from './sql';

export class Table<
  P extends TablePartitionType = any,
> extends DatabaseObject<Schema> {
  public declare parent: Schema;

  public readonly columns = new ColumnList();

  public readonly uniqueKeys = new DatabaseObjectList<
    TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY>
  >();

  public readonly checks = new DatabaseObjectList<
    TableConstraint<TableConstraintDiscriminant.CHECK>
  >();

  public readonly foreignKeys = new DatabaseObjectList<
    TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY>
  >();

  public partitioning?: TablePartitionStrategy<P>;

  public unlogged?: boolean;

  private _primaryKey?: TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY>;

  public constructor(name: TableName, schema: Schema) {
    super(name, schema);
  }

  // Getters -------------------------------------------------------------------
  public get uniqueConstraintName(): TableConstraintName {
    return `${this.name}_pkey`;
  }

  public get schema(): Schema {
    return this.parent;
  }

  public get database(): Database {
    return this.schema.database;
  }

  public get primaryKey():
    | TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY>
    | undefined {
    return this._primaryKey;
  }

  // Setters -------------------------------------------------------------------

  public defineColumn<D extends DataType<any, any>>(
    type: D,
    name: ColumnName,
    options: { nullable?: boolean; default?: string; comment?: string } = {},
  ): Column<D> {
    const column = new Column<D>(type, name, this);

    this.columns.add(column);

    if (options.nullable) {
      column.defineNull();
    }
    if (options.default) {
      column.defineDefault({
        expression: options.default,
      });
    }

    if (options.comment) {
      column.comment = options.comment;
    }

    return column;
  }

  public definePrimaryKey(
    name: string,
    args: TablePrimaryKeyConstraintArgs,
  ): TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY> {
    this._primaryKey =
      new TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY>(
        TableConstraintDiscriminant.PRIMARY_KEY,
        name,
        this,
        args,
      );

    return this._primaryKey;
  }

  public defineUniqueKey(
    name: string,
    args: TableUniqueConstraintArgs,
  ): TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY> {
    const uniqueKey =
      new TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY>(
        TableConstraintDiscriminant.UNIQUE_KEY,
        name,
        this,
        args,
      );

    this.uniqueKeys.add(uniqueKey);

    return uniqueKey;
  }

  public defineForeignKey(
    name: string,
    args: TableForeignKeyConstraintArgs,
  ): TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY> {
    const foreignKey =
      new TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY>(
        TableConstraintDiscriminant.FOREIGN_KEY,
        name,
        this,
        args,
      );

    this.foreignKeys.add(foreignKey);

    return foreignKey;
  }

  public defineCheckConstraint(
    name: string,
    args: TableCheckConstraintArgs,
  ): TableConstraint<TableConstraintDiscriminant.CHECK> {
    const check = new TableConstraint<TableConstraintDiscriminant.CHECK>(
      TableConstraintDiscriminant.CHECK,
      name,
      this,
      args,
    );

    this.checks.add(check);

    return check;
  }

  public defineCreatedAtColumn(
    propertyKey?: string,
  ): Column<DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date>> {
    const dataType = this.database.dataTypes.getTimestamptz();
    const columnName = 'created_at';

    const column = this.defineColumn(dataType, columnName, {
      default: 'now()',
    });
    column.propertyKey = propertyKey ?? columnName;

    return column;
  }

  public defineUpdatedAtColumn(
    propertyKey?: string,
  ): Column<DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date>> {
    const dataType = this.database.dataTypes.getTimestamptz();
    const columnName = 'updated_at';

    const column = this.defineColumn(dataType, columnName, {
      default: 'now()',
    });
    column.propertyKey = propertyKey ?? columnName;

    return column;
  }

  public definePartitionStrategy<T extends TablePartitionType>(
    type: T,
    key: TablePartitionKey<T>,
    buildPartitionName: TablePartitionNameBuilder<T>,
  ): TablePartitionStrategy<T> {
    this.partitioning = new TablePartitionStrategy<T>(
      type,
      key,
      buildPartitionName,
      this,
    ) as any;

    return this.partitioning as unknown as TablePartitionStrategy<T>;
  }

  public prepareCreateSql(): CreateTableSql.Query {
    return CreateTableSql.create(this);
  }

  public prepareExistsSql(): TableExistsSql.Query {
    return TableExistsSql.create(this);
  }

  public prepareDropSql(): DropTableSql.Query {
    return DropTableSql.create(this);
  }

  public prepareCreatePartitionSql(): CreateTablePartitionSql.Query<P> {
    return CreateTablePartitionSql.create(this);
  }

  public prepareInsertSql<V = object>(): InsertIntoTableSql.Query<V> {
    return InsertIntoTableSql.create(this);
  }
}
