import { escapeIdentifier } from 'pg';
import { DataType, DataTypeDiscriminant } from '../model';

export interface SchemaOwnedObjectFragment {
  name: string;
  schema: { name: string };
}

export function getIfNotExistsSql(ifNotExists?: boolean): string {
  return ifNotExists ? 'IF NOT EXISTS' : '';
}

export function getIfExistsSql(ifExists?: boolean): string {
  return ifExists ? 'IF EXISTS' : '';
}

export function getCascadeSql(cascade?: boolean): string {
  return cascade ? 'CASCADE' : 'RESTRICT';
}

export function getNullableSql(nullable: boolean): string {
  return nullable ? 'NULL' : 'NOT NULL';
}

export function getDefaultExpressionSql(defaultExpression?: string): string {
  return defaultExpression ? `DEFAULT ${defaultExpression}` : '';
}

export function getAuthorizationSql(roleSpecification?: string): string {
  if (roleSpecification === 'CURRENT_USER') {
    return 'AUTHORIZATION CURRENT_USER';
  } else if (roleSpecification === 'SESSION_USER') {
    return 'AUTHORIZATION SESSION_USER';
  } else if (roleSpecification === 'USER') {
    return 'AUTHORIZATION USER';
  } else {
    return roleSpecification
      ? `AUTHORIZATION ${escapeIdentifier(roleSpecification)}`
      : '';
  }
}

export function getDataTypeSql<N extends DataTypeDiscriminant>(
  dataType: DataType<N>,
): string {
  if (DataType.isOfType(dataType, DataTypeDiscriminant.VARCHAR)) {
    return `VARCHAR(${dataType.args.length})`;
  } else if (DataType.isOfType(dataType, DataTypeDiscriminant.CHAR)) {
    return `CHAR(${dataType.args.length})`;
  } else {
    return dataType.name.toUpperCase();
  }
}

export function getSchemaQualifiedName(
  table: SchemaOwnedObjectFragment,
): string;
export function getSchemaQualifiedName(
  schemaName: string,
  tableName: string,
): string;
export function getSchemaQualifiedName(
  arg1: string | SchemaOwnedObjectFragment,
  arg2?: string,
): string {
  const schemaName = typeof arg1 === 'string' ? arg1 : arg1.schema.name;
  const tableName = String(typeof arg1 === 'string' ? arg2 : arg1.name);

  return `${escapeIdentifier(schemaName)}.${escapeIdentifier(tableName)}`;
}

export function getReturningSql(columns?: string[]): string {
  return columns?.length
    ? `RETURNING ${columns.map(escapeIdentifier).join(', ')}`
    : '';
}
