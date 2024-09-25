import type { ColumnConstraintDiscriminant } from './column-constraint.discriminant';

export interface ColumnDefaultConstraintArgs {
  expression: string;
}

// prettier-ignore
export type ColumnConstraintArgs<
  D extends ColumnConstraintDiscriminant = ColumnConstraintDiscriminant,
> = D extends ColumnConstraintDiscriminant.DEFAULT
  ? ColumnDefaultConstraintArgs
  : object;
