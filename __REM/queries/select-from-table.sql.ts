import {
  type Condition,
  Identifier,
  OrderBy,
  Paging,
  Where,
  type OrderByArgs,
} from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface SelectFromTableArgs {
  table: string;
  schema?: string;
  columns?: string[];
  where?: Condition;
  orderBy?: OrderByArgs | OrderByArgs[];
  limit?: number;
  offset?: number;
}

const DEFAULT_LIMIT = 100;

export function SelectFromTableSql(args: SelectFromTableArgs): QueryConfig {
  const schema = args.schema ?? 'public';
  const limit = args.limit ?? DEFAULT_LIMIT;
  const offset = args.offset ?? 0;

  return sql`
    SELECT ${args.columns?.join(', ')} 
    FROM ${Identifier(`${schema}.${args.table}`)}
      ${Where(args.where)}
      ${OrderBy(args.orderBy)}
      ${Paging(limit, offset)}
  `;
}
