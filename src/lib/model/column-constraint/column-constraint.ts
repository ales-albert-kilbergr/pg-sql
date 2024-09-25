/* eslint-disable @typescript-eslint/max-params */
import type { identifier } from '../identifier';
import type { Column } from '../column';
import { DatabaseObject } from '../database-object/database-object';
import type { ColumnConstraintDiscriminant } from './column-constraint.discriminant';
import type { ColumnConstraintArgs } from './column-constraint.types';

export class ColumnConstraint<
  D extends ColumnConstraintDiscriminant,
> extends DatabaseObject<Column> {
  public declare parent: Column;

  public type: ColumnConstraintDiscriminant;

  public args: ColumnConstraintArgs<D>;

  public constructor(
    type: D,
    name: identifier,
    parent: Column,
    args: ColumnConstraintArgs<D>,
  ) {
    super(name, parent);

    this.type = type;
    this.args = args;
  }

  public getArg(
    key: keyof ColumnConstraintArgs<D>,
  ): ColumnConstraintArgs<D>[typeof key] {
    return this.args[key];
  }

  public setArg(
    key: keyof ColumnConstraintArgs<D>,
    value: ColumnConstraintArgs<D>[typeof key],
  ): void {
    this.args[key] = value;
  }
}
