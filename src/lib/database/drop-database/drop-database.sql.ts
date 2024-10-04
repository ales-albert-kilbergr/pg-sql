import { formatSqlText } from '../../helpers';
import { escapeIdentifier } from 'pg';
import { getIfExistsSql } from '../../sql';

/**
 * @see https://www.postgresql.org/docs/current/sql-dropdatabase.html
 */
export interface DropDatabaseSqlArgs {
  database: { name: string };
  ifExists?: boolean;
  withForce?: boolean;
}

export function getDropDatabaseSql(command: DropDatabaseSqlArgs): string {
  const databaseName = escapeIdentifier(command.database.name);
  const ifExists = getIfExistsSql(command.ifExists);
  const withForce = command.withForce ? 'WITH (FORCE)' : '';

  return formatSqlText(
    `DROP DATABASE ${ifExists} ${databaseName} ${withForce};`,
  );
}
