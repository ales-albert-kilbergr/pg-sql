import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export declare namespace TableExists {
  interface Args {
    schema: string;
    table: string;
  }
}

export function TableExists(args: TableExists.Args): QueryConfig {
  return sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = :${args.schema}
      AND table_name = :${args.table}
    ) as "exists";
  `;
}
