import { escapeIdentifier } from 'pg';
import { formatSqlText } from '../../helpers';
import {
  ReferentialActionDiscriminant,
  type ConstraintIndexParameters,
  type ReferentialAction,
  type TableConstraint,
  type TableConstraintDiscriminant,
} from '../table-constraint';
import {
  getDataTypeSql,
  getDefaultExpressionSql,
  getNullableSql,
  getSchemaQualifiedName,
} from '../../sql';
import type { Table } from '../table';
import type { Column } from '../../column';

/**
 * Create Table SQL Command.
 *
 * @link https://www.postgresql.org/docs/current/sql-createtable.html
 */
export interface CreateTableSqlArgs {
  table: Table;
  ifNotExists: boolean;
}

function getColumnSql(column: Column): string {
  const columnName = escapeIdentifier(column.name);
  const dataType = getDataTypeSql(column.type);
  const nullable = getNullableSql(column.isNullable());
  const defaultExpr = getDefaultExpressionSql(column.default?.args.expression);

  return formatSqlText(`${columnName} ${dataType} ${nullable} ${defaultExpr}`);
}

function getIndexParametersSql(
  indexParameters: ConstraintIndexParameters,
): string {
  const include = indexParameters.include
    ? `INCLUDE (${indexParameters.include.map(escapeIdentifier).join(', ')})`
    : '';

  const withClause = indexParameters.with
    ? `WITH (${indexParameters.with.join(', ')})`
    : '';

  const usingIndexTablespace = indexParameters.usingIndexTablespace
    ? `USING INDEX TABLESPACE ${escapeIdentifier(indexParameters.usingIndexTablespace)}`
    : '';

  return formatSqlText(`
    ${include}
    ${withClause}
    ${usingIndexTablespace}
  `);
}

function getPrimaryKeySql(
  primaryKey?: TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY>,
): string {
  if (!primaryKey) {
    return '';
  }
  const { args, name } = primaryKey;

  const constraintName = escapeIdentifier(name);
  const columns = args.columns.map(escapeIdentifier).join(', ');
  const indexParameters = getIndexParametersSql(args);

  return formatSqlText(`
    CONSTRAINT ${constraintName} 
    PRIMARY KEY (${columns}) ${indexParameters}
  `);
}

function getUniqueKeySql(
  uniqueKey?: TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY>,
): string {
  if (!uniqueKey) {
    return '';
  }
  const { args, name } = uniqueKey;

  const constraintName = escapeIdentifier(name);
  const columns = args.columns.map(escapeIdentifier).join(', ');
  const indexParameters = getIndexParametersSql(args);
  const nulls = args.nullsNotDistinct ? 'NULLS NOT DISTINCT' : '';

  return formatSqlText(`
    CONSTRAINT ${constraintName} 
    UNIQUE ${nulls} (${columns}) ${indexParameters}
  `);
}

function getReferenceActionSql(action?: ReferentialAction): string {
  if (action?.type === ReferentialActionDiscriminant.SET_NULL) {
    return `SET NULL (${action.columns.map(escapeIdentifier).join(', ')})`;
  } else if (action?.type === ReferentialActionDiscriminant.SET_DEFAULT) {
    return `SET DEFAULT (${action.columns.map(escapeIdentifier).join(', ')})`;
  } else {
    return action?.type ?? '';
  }
}

function getForeignKeySql(
  foreignKey?: TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY>,
): string {
  if (!foreignKey) {
    return '';
  }
  const { args, name } = foreignKey;

  const constraintName = escapeIdentifier(name);
  const columns = args.columns.map(escapeIdentifier).join(', ');
  const refTable = escapeIdentifier(args.refTable);
  const refColumns = args.refColumns.map(escapeIdentifier).join(', ');
  const matchType = args.matchType ? `MATCH ${args.matchType}` : '';
  const onDelete = args.onDelete
    ? `ON DELETE ${getReferenceActionSql(args.onDelete)}`
    : '';
  const onUpdate = args.onUpdate
    ? `ON UPDATE ${getReferenceActionSql(args.onUpdate)}`
    : '';

  return formatSqlText(`
    CONSTRAINT ${constraintName} 
    FOREIGN KEY (${columns}) 
    REFERENCES ${refTable} (${refColumns}) 
      ${matchType} ${onDelete} ${onUpdate}
  `);
}

export function getCreateTableSql(command: CreateTableSqlArgs): string {
  const schemaQualifiedName = getSchemaQualifiedName(command.table);
  const ifNotExists = command.ifNotExists ? 'IF NOT EXISTS' : '';

  const columns = Array.from(command.table.columns)
    .map(getColumnSql)
    .join(',\n\t');

  const primaryKey = getPrimaryKeySql(command.table.primaryKey);

  const uniqueKeys = Array.from(command.table.uniqueKeys)
    .map(getUniqueKeySql)
    .join(',\n\t');

  const foreignKeys = Array.from(command.table.foreignKeys)
    .map(getForeignKeySql)
    .join(',\n\t');

  return formatSqlText(`
    CREATE TABLE ${ifNotExists} ${schemaQualifiedName} (
      ${[columns, primaryKey, uniqueKeys, foreignKeys].filter(Boolean).join(',\n\t')}
    );
  `);
}
