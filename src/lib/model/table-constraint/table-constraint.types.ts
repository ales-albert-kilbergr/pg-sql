import type {
  ColumnName,
  ConstraintIndexParameters,
  ReferenceMatchType,
  ReferentialAction,
  TableName,
} from '../common';
import type { TableConstraintDiscriminant } from './table-constraint.discriminant';

export interface TableCheckConstraintArgs {
  expression: string;
  noInherit?: boolean;
}

export interface TableUniqueConstraintArgs extends ConstraintIndexParameters {
  nullsNotDistinct?: boolean;
  deferrable?: boolean;
  deferred?: boolean;
  columns: ColumnName[];
}

export interface TablePrimaryKeyConstraintArgs
  extends ConstraintIndexParameters {
  columns: ColumnName[];
  deferrable?: boolean;
  deferred?: boolean;
}

export interface TableForeignKeyConstraintArgs {
  refTable: TableName;
  refColumns: ColumnName[];
  matchType?: ReferenceMatchType;
  onDelete?: ReferentialAction;
  onUpdate?: ReferentialAction;
  columns: ColumnName[];
}

// prettier-ignore
export type TableConstraintArgs<D extends TableConstraintDiscriminant> =
  D extends TableConstraintDiscriminant.CHECK
  ? TableCheckConstraintArgs
  : D extends TableConstraintDiscriminant.UNIQUE_KEY
  ? TableUniqueConstraintArgs
  : D extends TableConstraintDiscriminant.PRIMARY_KEY
  ? TablePrimaryKeyConstraintArgs
  : D extends TableConstraintDiscriminant.FOREIGN_KEY
  ? TableForeignKeyConstraintArgs
  : object;
