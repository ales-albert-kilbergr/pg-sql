import type { WithArgsAccessors } from '../../args';
import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { DropTableArgs } from './drop-table.args';
import { getDropTableSql } from './drop-table.sql';

export * from './drop-table.args';
export * from './drop-table.sql';

export type PreparedDropTableCommand = WithArgsAccessors<
  DropTableArgs,
  PreparedSqlCommand<DropTableArgs>
>;

export type DropTableCommand = WithArgsAccessors<
  DropTableArgs,
  SqlCommand<DropTableArgs>
>;

export function prepareDropTableCommand(): PreparedDropTableCommand {
  return PreparedSqlCommand.create(DropTableArgs).useSqlTextBuilder(
    getDropTableSql,
  );
}
