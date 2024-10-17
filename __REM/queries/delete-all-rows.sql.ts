import { Identifier } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface DeleteTableRowsArgs {
  schema: string;
  table: string;
}

export function DeleteTableRowsSql(args: DeleteTableRowsArgs): QueryConfig {
  return sql`
    DELETE FROM ${Identifier(`${args.schema}.${args.table}`)};
  `;
}
