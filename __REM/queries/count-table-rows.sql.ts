import { Identifier } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface CountTableRowArgs {
  table: string;
  schema: string;
}

export function CountTableRowSql(args: CountTableRowArgs): QueryConfig {
  return sql`
    SELECT COUNT(1)
    FROM ${Identifier(`${args.schema}.${args.table}`)};
  `;
}
