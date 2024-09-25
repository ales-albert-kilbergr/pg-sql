import { Identifier } from '../identifier';
import {
  ColumnConstraint,
  ColumnConstraintDiscriminant,
  type ColumnDefaultConstraintArgs,
} from '../column-constraint';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import { DatabaseObject } from '../database-object/database-object';
import type { identifier } from '../identifier';
import type { Schema } from '../schema';
import type { Table } from '../table/table';
import type {
  TableCheckConstraintArgs,
  TableConstraint,
  TableConstraintDiscriminant,
  TableForeignKeyConstraintArgs,
  TablePrimaryKeyConstraintArgs,
  TableUniqueConstraintArgs,
} from '../table-constraint';

export class Column<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  D extends DataType<any, any> = DataType<DataTypeDiscriminant, unknown>,
> extends DatabaseObject<Table> {
  public declare parent: Table;

  public readonly type: D;

  /**
   * The property key of the column.
   */
  public propertyKey: string;

  private _nullable:
    | ColumnConstraint<ColumnConstraintDiscriminant.NOT_NULL>
    | ColumnConstraint<ColumnConstraintDiscriminant.NULL> =
    new ColumnConstraint<ColumnConstraintDiscriminant.NOT_NULL>(
      ColumnConstraintDiscriminant.NOT_NULL,
      Identifier(`nn_${this.table.name}_${this.name}`),
      this,
      {},
    );

  private _default?: ColumnConstraint<ColumnConstraintDiscriminant.DEFAULT>;

  public constructor(type: D, name: identifier, table: Table) {
    super(name, table);

    this.type = type;
    this.propertyKey = name;
  }

  public get table(): Table {
    return this.parent;
  }

  public get schema(): Schema {
    return this.table.schema;
  }

  // Getters -------------------------------------------------------------------
  public get uniqueConstraintName(): identifier {
    return Identifier(`${this.table.name}_${this.name}_key`);
  }
  /**
   * Get a default check constraint name for the column.
   */
  public get checkConstraintName(): identifier {
    return Identifier(`${this.table.name}_${this.name}_check`);
  }

  public get default():
    | ColumnConstraint<ColumnConstraintDiscriminant.DEFAULT>
    | undefined {
    return this._default;
  }

  // Constraint factories ------------------------------------------------------
  public definePrimaryKey(
    args: Omit<TablePrimaryKeyConstraintArgs, 'columns'> = {},
  ): TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY> {
    return this.table.definePrimaryKey(this.table.uniqueConstraintName, {
      columns: [this.name],
      ...args,
    });
  }

  public defineUniqueKey(
    args: Omit<TableUniqueConstraintArgs, 'columns'> = {},
  ): TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY> {
    return this.table.defineUniqueConstraint(this.uniqueConstraintName, {
      columns: [this.name],
      ...args,
    });
  }

  public defineCheckConstraint(
    args: Omit<TableCheckConstraintArgs, 'columns'>,
  ): TableConstraint<TableConstraintDiscriminant.CHECK> {
    return this.table.defineCheckConstraint(this.checkConstraintName, {
      ...args,
    });
  }

  public defineNotNull(): ColumnConstraint<ColumnConstraintDiscriminant.NOT_NULL> {
    this._nullable =
      new ColumnConstraint<ColumnConstraintDiscriminant.NOT_NULL>(
        ColumnConstraintDiscriminant.NOT_NULL,
        Identifier(`nn_${this.table.name}_${this.name}`),
        this,
        {},
      );

    return this._nullable;
  }

  public defineNull(): ColumnConstraint<ColumnConstraintDiscriminant.NULL> {
    this._nullable = new ColumnConstraint<ColumnConstraintDiscriminant.NULL>(
      ColumnConstraintDiscriminant.NULL,
      Identifier(`n_${this.table.name}_${this.name}`),
      this,
      {},
    );

    return this._nullable;
  }

  public defineDefault(
    args: ColumnDefaultConstraintArgs,
  ): ColumnConstraint<ColumnConstraintDiscriminant.DEFAULT> {
    this._default = new ColumnConstraint<ColumnConstraintDiscriminant.DEFAULT>(
      ColumnConstraintDiscriminant.DEFAULT,
      Identifier(`d_${this.table.name}_${this.name}`),
      this,
      args,
    );

    return this._default;
  }

  public defineForeignKey(
    args: Omit<TableForeignKeyConstraintArgs, 'columns'>,
  ): TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY> {
    const constraintName = Identifier(`${this.table.name}_${this.name}_fkey`);

    return this.table.defineForeignKey(constraintName, {
      columns: [this.name],
      ...args,
    });
  }

  // Constraint checks ---------------------------------------------------------
  public isInPrimaryKey(): boolean {
    return this.table.primaryKey?.args.columns.includes(this.name) ?? false;
  }

  public isUniqueKey(): boolean {
    return this.table.uniqueKeys.has(this.uniqueConstraintName);
  }

  public isNullable(): boolean {
    return this._nullable.type === ColumnConstraintDiscriminant.NULL;
  }

  // Constraint removal --------------------------------------------------------
  public removeDefaultConstraint(): void {
    this._default = undefined;
  }
}
