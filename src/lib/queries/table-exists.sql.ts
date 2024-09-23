import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface TableExistsArgs {
  schema: string;
  table: string;
}

export function TableExistsSql(args: TableExistsArgs): QueryConfig {
  return sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = :${args.schema}
      AND table_name = :${args.table}
    ) as "exists";
  `;
}
