import { escapeIdentifier } from 'pg';
import { formatSqlText } from '../../helpers';

export interface CreateDatabaseSqlArgs {
  database: string | { name: string };
  withOwner?: string;
}

export function getCreateDatabaseSql(args: CreateDatabaseSqlArgs): string {
  const databaseName = escapeIdentifier(
    typeof args.database === 'string' ? args.database : args.database.name,
  );

  const withParams = [];

  if (args.withOwner) {
    withParams.push(`OWNER = ${escapeIdentifier(args.withOwner)}`);
  }

  const withParamsText = withParams.length
    ? `WITH ${withParams.join(' ')}`
    : '';

  return formatSqlText(`
    CREATE DATABASE ${databaseName}
    ${withParamsText};
  `);
}
