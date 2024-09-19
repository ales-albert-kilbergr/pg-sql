import type { QueryConfig } from '../../query-config';
import { sql } from '../../sql';

export declare namespace SelectColumnType {
  interface Args {
    schema: string;
    table: string;
    column: string;
  }
}

export function SelectColumnType(args: SelectColumnType.Args): QueryConfig {
  return sql`
    SELECT data_type
    FROM information_schema.columns WHERE 
      table_schema = :${args.schema} AND
      table_name = :${args.table} AND
      column_name = :${args.column};
  `;
}
