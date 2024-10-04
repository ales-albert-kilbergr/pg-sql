import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { getCreateDatabaseSql } from './create-database.sql';
import type { Database } from '../database';
import { CreateDatabaseArgs } from './create-database.args';
import type { WithArgsAccessors } from '../../args';

export type PreparedCreateDatabaseCommand = WithArgsAccessors<
  CreateDatabaseArgs,
  PreparedSqlCommand<CreateDatabaseArgs>
>;

export type CreateDatabaseCommand = WithArgsAccessors<
  CreateDatabaseArgs,
  SqlCommand<CreateDatabaseArgs>
>;

export function prepareCreateDatabaseCommand(
  database: Database,
): PreparedCreateDatabaseCommand {
  return PreparedSqlCommand.create(CreateDatabaseArgs)
    .database(database)
    .useSqlTextBuilder(getCreateDatabaseSql);
}
