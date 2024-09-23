import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface SelectColumnTypeArgs {
  schema: string;
  table: string;
  column: string;
}

export function SelectColumnTypeSql(args: SelectColumnTypeArgs): QueryConfig {
  return sql`
    SELECT data_type
    FROM information_schema.columns WHERE 
      table_schema = :${args.schema} AND
      table_name = :${args.table} AND
      column_name = :${args.column};
  `;
}
