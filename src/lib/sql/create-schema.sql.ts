import {
  Identifier,
  IfNotExists,
  SchemaAuthorization,
  type SchemaAuthorizationType,
} from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export declare namespace CreateSchema {
  interface Args {
    schema: string;
    ifNotExists?: boolean;
    authorization?: SchemaAuthorizationType | null;
  }
}

export function CreateSchema(args: CreateSchema.Args): QueryConfig {
  return sql`
    CREATE SCHEMA 
      ${IfNotExists(args.ifNotExists)}
      ${Identifier(args.schema)} 
      ${SchemaAuthorization(args.authorization)};
  `;
}
