import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface SchemaExistsArgs {
  schema: string;
}

export function SchemaExistsSql(args: SchemaExistsArgs): QueryConfig {
  return sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.schemata
      WHERE schema_name = :${args.schema}
    ) as "exists";
  `;
}
