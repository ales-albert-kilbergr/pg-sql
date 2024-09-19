import type { QueryConfig } from '../../query-config';
import { sql } from '../../sql';

export declare namespace SchemaExists {
  interface Args {
    schema: string;
  }
}

export function SchemaExists(args: SchemaExists.Args): QueryConfig {
  return sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.schemata
      WHERE schema_name = :${args.schema}
    ) as "exists";
  `;
}
