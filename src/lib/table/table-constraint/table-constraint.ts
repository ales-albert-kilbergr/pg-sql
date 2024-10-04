/* eslint-disable @typescript-eslint/max-params */
import { DatabaseObject, type DatabaseObjectName } from '../../database-object';
import type { Table } from '../table';
import type { TableConstraintDiscriminant } from './table-constraint.discriminant';
import type { TableConstraintArgs } from './table-constraint.types';

export type TableConstraintName = DatabaseObjectName;

export class TableConstraint<
  D extends TableConstraintDiscriminant = TableConstraintDiscriminant,
> extends DatabaseObject<Table> {
  public declare parent: Table;

  public type: TableConstraintDiscriminant;

  public args: TableConstraintArgs<D>;

  public constructor(
    type: D,
    name: TableConstraintName,
    parent: Table,
    args: TableConstraintArgs<D>,
  ) {
    super(name, parent);

    this.type = type;
    this.args = args;
  }

  public getArg(
    key: keyof TableConstraintArgs<D>,
  ): TableConstraintArgs<D>[typeof key] {
    return this.args[key];
  }

  public setArg(
    key: keyof TableConstraintArgs<D>,
    value: TableConstraintArgs<D>[typeof key],
  ): void {
    this.args[key] = value;
  }
}
