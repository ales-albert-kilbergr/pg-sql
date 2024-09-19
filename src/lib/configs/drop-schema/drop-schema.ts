import { Cascade, Identifier, IfExists } from '../../nodes';
import type { QueryConfig } from '../../query-config';
import { sql } from '../../sql';

export declare namespace DropSchema {
  interface Args {
    schema: string;
    ifExists?: boolean;
    cascade?: boolean;
  }
}

export function DropSchema(args: DropSchema.Args): QueryConfig {
  return sql`
    DROP SCHEMA 
      ${IfExists(args.ifExists)}
      ${Identifier(args.schema)} 
      ${Cascade(args.cascade)};
  `;
}
