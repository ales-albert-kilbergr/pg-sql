/* eslint-disable @typescript-eslint/no-explicit-any */
import { Identifier, type identifier } from '../identifier';
import { ColumnList } from '../column';
import { Column } from '../column';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import { DatabaseObject, DatabaseObjectList } from '../database-object';
import type { Database } from '../database';
import type { Schema } from '../schema';
import type { ColumnName, TableName } from '../common';
import {
  type TableCheckConstraintArgs,
  TableConstraint,
  TableConstraintDiscriminant,
  type TableForeignKeyConstraintArgs,
  type TablePrimaryKeyConstraintArgs,
  type TableUniqueConstraintArgs,
} from '../table-constraint';

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
  public get uniqueConstraintName(): identifier {
    return Identifier(`${this.name}_pkey`);
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
  ): Column<D> {
    const column = new Column<D>(type, name, this);

    this.columns.add(column);

    return column;
  }

  public definePrimaryKey(
    name: identifier,
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

  public defineUniqueConstraint(
    name: identifier,
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
    name: identifier,
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
    name: identifier,
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

  public defineCreatedAtColumn(): Column<
    DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date>
  > {
    const dataType = this.database.dataTypes.getTimestamptz();

    return this.defineColumn(dataType, Identifier('created_at'));
  }

  public defineUpdatedAtColumn(): Column<
    DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date>
  > {
    return this.defineColumn(
      this.database.dataTypes.getTimestamptz(),
      Identifier('updated_at'),
    );
  }
}
