import type { identifier } from '../identifier';

export type ColumnName = identifier;

export type TableName = identifier;

export type TablespaceName = identifier;

export type ConstraintName = identifier;
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

export type ReferenceMatchType = 'FULL' | 'PARTIAL' | 'SIMPLE';

export enum SchemaAuthorization {
  CURRENT_ROLE = 'CURRENT_ROLE',
  CURRENT_USER = 'CURRENT_USER',
  SESSION_USER = 'SESSION_USER',
}
