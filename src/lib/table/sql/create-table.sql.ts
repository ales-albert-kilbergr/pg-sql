import { escapeIdentifier, type QueryResult } from 'pg';
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
import {
  type HashPartitionKey,
  type ListPartitionKey,
  type RangePartitionKey,
  TablePartitionType,
} from '../table-partition';
import {
  type SqlErrorMarcherContext,
  SqlQuery,
  type SqlQueryWithArgs,
} from '../../sql-query';

export class Args {
  public table!: Table;

  public ifNotExists = false;
}

export type Query = SqlQueryWithArgs<
  Args,
  QueryResult,
  TableCreationFailedException
>;

export function getColumnSql(column: Column): string {
  const columnName = escapeIdentifier(column.name);
  const dataType = getDataTypeSql(column.type);
  const nullable = getNullableSql(column.isNullable());
  const defaultExpr = getDefaultExpressionSql(column.default?.args.expression);

  return formatSqlText(`${columnName} ${dataType} ${nullable} ${defaultExpr}`);
}

export function getIndexParametersSql(
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

export function getPrimaryKeySql(
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

export function getUniqueKeySql(
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

export function getReferenceActionSql(action?: ReferentialAction): string {
  if (action?.type === ReferentialActionDiscriminant.SET_NULL) {
    return `SET NULL (${action.columns.map(escapeIdentifier).join(', ')})`;
  } else if (action?.type === ReferentialActionDiscriminant.SET_DEFAULT) {
    return `SET DEFAULT (${action.columns.map(escapeIdentifier).join(', ')})`;
  } else {
    return action?.type ?? '';
  }
}

export function getForeignKeySql(
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

export function getPartitionBySql(table: Table): string {
  if (!table.partitioning) {
    return '';
  }

  if (table.partitioning.type === TablePartitionType.LIST) {
    const partitionKey = table.partitioning.key as ListPartitionKey;
    const expression =
      partitionKey.fragment.kind === 'expression'
        ? partitionKey.fragment.value
        : escapeIdentifier(partitionKey.fragment.value);

    return `PARTITION BY LIST (${expression})`;
  } else if (table.partitioning.type === TablePartitionType.RANGE) {
    const partitionKey = table.partitioning.key as RangePartitionKey;
    const expression = partitionKey.fragments
      .map((fragment) => {
        return fragment.kind === 'expression'
          ? fragment.value
          : escapeIdentifier(fragment.value);
      })
      .join(', ');

    return `PARTITION BY RANGE (${expression})`;
  } else if (table.partitioning.type === TablePartitionType.HASH) {
    const partitionKey = table.partitioning.key as HashPartitionKey;
    const expression = partitionKey.fragments
      .map((fragment) => {
        return fragment.kind === 'expression'
          ? fragment.value
          : escapeIdentifier(fragment.value);
      })
      .join(', ');

    return `PARTITION BY HASH (${expression})`;
  } else {
    throw new Error(`Unsupported partition type "${table.partitioning.type}"`);
  }
}

export function getSql(command: Args): string {
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

  const partitionBy = getPartitionBySql(command.table);

  return formatSqlText(`
    CREATE TABLE ${ifNotExists} ${schemaQualifiedName} (
      ${[columns, primaryKey, uniqueKeys, foreignKeys].filter(Boolean).join(',\n\t')}
    ) ${partitionBy};
  `);
}

export class TableCreationFailedException extends Error {
  public readonly table: string;

  public readonly origError: Error;

  public readonly sql: string;

  public constructor(table: string, sql: string, origError: Error) {
    super(`Failed to create table: ${table}. ${origError.message}`);

    this.table = table;
    this.origError = origError;
    this.sql = sql;
  }
}

export function matchError(
  error: unknown,
  ctx: SqlErrorMarcherContext<Args>,
): TableCreationFailedException {
  return new TableCreationFailedException(
    ctx.args.table.name,
    ctx.queryConfig.text,
    error instanceof Error ? error : new Error(String(error)),
  );
}

export function create(table?: Table): Query {
  const query = SqlQuery.from(Args)
    .useSqlTextBuilder(getSql)
    .useErrorMatcher(matchError);

  if (table) {
    query.table(table);
  }

  return query;
}
