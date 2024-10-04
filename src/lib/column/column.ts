import {
  ColumnConstraint,
  ColumnConstraintDiscriminant,
  type ColumnDefaultConstraintArgs,
} from './column-constraint';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import {
  DatabaseObject,
  type DatabaseObjectName,
  type ConstraintName,
} from '../database-object';
import type { Schema } from '../schema';
import type {
  Table,
  TableCheckConstraintArgs,
  TableConstraint,
  TableConstraintDiscriminant,
  TableForeignKeyConstraintArgs,
  TablePrimaryKeyConstraintArgs,
  TableUniqueConstraintArgs,
} from '../table';

export type ColumnName = DatabaseObjectName;

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
      `nn_${this.table.name}_${this.name}`,
      this,
      {},
    );

  private _default?: ColumnConstraint<ColumnConstraintDiscriminant.DEFAULT>;

  public constructor(type: D, name: ColumnName, table: Table) {
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
  public get uniqueConstraintName(): ConstraintName {
    return `${this.table.name}_${this.name}_key`;
  }
  /**
   * Get a default check constraint name for the column.
   */
  public get checkConstraintName(): string {
    return `${this.table.name}_${this.name}_check`;
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
    return this.table.defineUniqueKey(this.uniqueConstraintName, {
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
        `nn_${this.table.name}_${this.name}`,
        this,
        {},
      );

    return this._nullable;
  }

  public defineNull(): ColumnConstraint<ColumnConstraintDiscriminant.NULL> {
    this._nullable = new ColumnConstraint<ColumnConstraintDiscriminant.NULL>(
      ColumnConstraintDiscriminant.NULL,
      `n_${this.table.name}_${this.name}`,
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
      `d_${this.table.name}_${this.name}`,
      this,
      args,
    );

    return this._default;
  }

  public defineForeignKey(
    args: Omit<TableForeignKeyConstraintArgs, 'columns'>,
  ): TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY> {
    const constraintName = `${this.table.name}_${this.name}_fkey`;

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
