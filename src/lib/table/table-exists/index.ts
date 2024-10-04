import type { WithArgsAccessors } from '../../args';
import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { TableExistsArgs } from './table-exists.args';
import { tableExistsPipe } from './table-exists.pipe';
import {
  getTableExistsSql,
  serializeTableExistsSqlValues,
} from './table-exists.sql';

export * from './table-exists.args';
export * from './table-exists.sql';

export type PreparedTableExistsCommand = WithArgsAccessors<
  TableExistsArgs,
  PreparedSqlCommand<TableExistsArgs, boolean>
>;

export type TableExistsCommand = WithArgsAccessors<
  TableExistsArgs,
  SqlCommand<TableExistsArgs, boolean>
>;

export function prepareTableExistsCommand(): PreparedTableExistsCommand {
  return PreparedSqlCommand.create(TableExistsArgs)
    .useSqlTextBuilder(getTableExistsSql)
    .useValueSerializer(serializeTableExistsSqlValues)
    .useResultParser(tableExistsPipe);
}
