/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnList, type ColumnName } from '../column';
import { Column } from '../column';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import {
  DatabaseObject,
  DatabaseObjectList,
  type DatabaseObjectName,
} from '../database-object';
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
  prepareCreateTableCommand,
  type PreparedCreateTableCommand,
} from './create-table';
import {
  type PreparedDropTableCommand,
  prepareDropTableCommand,
} from './drop-table';
import {
  type PreparedTableExistsCommand,
  prepareTableExistsCommand,
} from './table-exists';

export type TableName = DatabaseObjectName;

export type TablespaceName = DatabaseObjectName;

export class Table extends DatabaseObject<Schema> {
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
    options: { nullable?: boolean; default?: string } = {},
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

    const column = this.defineColumn(dataType, columnName);
    column.propertyKey = propertyKey ?? columnName;

    return column;
  }

  public defineUpdatedAtColumn(
    propertyKey?: string,
  ): Column<DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date>> {
    const dataType = this.database.dataTypes.getTimestamptz();
    const columnName = 'updated_at';

    const column = this.defineColumn(dataType, columnName);
    column.propertyKey = propertyKey ?? columnName;

    return column;
  }

  public prepareCreateTable(): PreparedCreateTableCommand {
    return prepareCreateTableCommand().table(this);
  }

  public prepareTableExists(): PreparedTableExistsCommand {
    return prepareTableExistsCommand().table(this);
  }

  public prepareDropTable(): PreparedDropTableCommand {
    return prepareDropTableCommand().table(this);
  }
}
