import type { SqlErrorMarcherContext } from '../../commands';
import type { CreateTableArgs } from './create-table.args';
import { TableCreationFailedException } from './table-creation-failed.exception';

export function createTableErrorMatcher(
  error: unknown,
  ctx: SqlErrorMarcherContext<CreateTableArgs>,
): TableCreationFailedException {
  return new TableCreationFailedException(
    ctx.args.table.name,
    ctx.queryConfig.text,
    error instanceof Error ? error : new Error(String(error)),
  );
}
