import { Cascade, Identifier, IfExists } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface DropSchemaArgs {
  schema: string;
  ifExists?: boolean;
  cascade?: boolean;
}
export function DropSchemaSql(args: DropSchemaArgs): QueryConfig {
  return sql`
    DROP SCHEMA 
      ${IfExists(args.ifExists)}
      ${Identifier(args.schema)} 
      ${Cascade(args.cascade)};
  `;
}
