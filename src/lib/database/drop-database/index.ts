import type { WithArgsAccessors } from '../../args';
import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import type { Database } from '../database';
import { DropDatabaseArgs } from './drop-database.args';
import { getDropDatabaseSql } from './drop-database.sql';

export type PreparedDropDatabaseCommand = WithArgsAccessors<
  DropDatabaseArgs,
  PreparedSqlCommand<DropDatabaseArgs>
>;

export type DropDatabaseCommand = WithArgsAccessors<
  DropDatabaseArgs,
  SqlCommand<DropDatabaseArgs>
>;

export function prepareDropDatabaseCommand(
  database: Database,
): PreparedDropDatabaseCommand {
  return PreparedSqlCommand.create(DropDatabaseArgs)
    .database(database)
    .ifExists(true)
    .useSqlTextBuilder(getDropDatabaseSql);
}
