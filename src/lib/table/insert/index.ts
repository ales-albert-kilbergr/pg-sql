import type { WithArgsAccessors } from '../../args';
import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { InsertArgs } from './insert.args';
import { getInsertSql } from './insert.sql';

export * from './insert.args';
export * from './insert.sql';

export type PreparedInsertCommand = WithArgsAccessors<
  InsertArgs,
  PreparedSqlCommand<InsertArgs>
>;

export type InsertCommand = WithArgsAccessors<
  InsertArgs,
  SqlCommand<InsertArgs>
>;

export function prepareInsertCommand(): PreparedInsertCommand {
  return PreparedSqlCommand.create(InsertArgs).useSqlTextBuilder(getInsertSql);
}
