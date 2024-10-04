import type { QueryResult } from 'pg';
import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { CreateTableArgs } from './create-table.args';
import type { TableCreationFailedException } from './table-creation-failed.exception';
import { getCreateTableSql } from './create-table.sql';
import { createTableErrorMatcher } from './create-table-error-matcher';
import type { WithArgsAccessors } from '../../args';

export type PreparedCreateTableCommand = WithArgsAccessors<
  CreateTableArgs,
  PreparedSqlCommand<CreateTableArgs, QueryResult, TableCreationFailedException>
>;

export type CreateTableCommand = WithArgsAccessors<
  CreateTableArgs,
  SqlCommand<CreateTableArgs, QueryResult, TableCreationFailedException>
>;

export function prepareCreateTableCommand(): PreparedCreateTableCommand {
  return PreparedSqlCommand.create(CreateTableArgs)
    .useSqlTextBuilder(getCreateTableSql)
    .useErrorMatcher(createTableErrorMatcher)
    .ifNotExists(true);
}
