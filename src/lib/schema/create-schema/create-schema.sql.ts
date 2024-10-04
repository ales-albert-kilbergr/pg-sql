import { escapeIdentifier } from 'pg';
import { getAuthorizationSql, getIfNotExistsSql } from '../../sql';
import { formatSqlText } from '../../helpers';

export interface CreateSchemaSqlArgs {
  schema: { name: string };
  ifNotExists?: boolean;
  authorization?: string;
}

export function getCreateSchemaSql(command: CreateSchemaSqlArgs): string {
  const schemaName = escapeIdentifier(command.schema.name);
  const authorization = getAuthorizationSql(command.authorization);
  const ifNotExists = getIfNotExistsSql(command.ifNotExists);

  return formatSqlText(
    `CREATE SCHEMA ${ifNotExists} ${authorization} ${schemaName};`,
  );
}
