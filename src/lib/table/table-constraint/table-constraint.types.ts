import type { ColumnName } from '../../column';
import type { TableName, TablespaceName } from '../../table';
import type { TableConstraintDiscriminant } from './table-constraint.discriminant';

/**
 * Referential action in a foreign key constraints can be one of the following:
 * - `NO ACTION`
 * - `RESTRICT`
 * - `CASCADE`
 * - `SET NULL ( column_name, ... )`
 * - `SET DEFAULT ( column_name, ... )`
 */
export enum ReferentialActionDiscriminant {
  NO_ACTION = 'NO ACTION',
  RESTRICT = 'RESTRICT',
  CASCADE = 'CASCADE',
  SET_NULL = 'SET NULL',
  SET_DEFAULT = 'SET DEFAULT',
}

export type ReferentialAction<
  D extends ReferentialActionDiscriminant = ReferentialActionDiscriminant,
> = D extends
  | ReferentialActionDiscriminant.SET_NULL
  | ReferentialActionDiscriminant.SET_DEFAULT
  ? {
      type: D;
      columns: ColumnName[];
    }
  : { type: D };

export interface ConstraintIndexParameters {
  include?: ColumnName[];
  with?: string[];
  usingIndexTablespace?: TablespaceName;
}

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

export type ReferenceMatchType = 'FULL' | 'PARTIAL' | 'SIMPLE';

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
