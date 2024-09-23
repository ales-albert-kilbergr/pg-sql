import {
  Identifier,
  IfNotExists,
  SchemaAuthorization,
  type SchemaAuthorizationType,
} from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface CreateSchemaArgs {
  schema: string;
  ifNotExists?: boolean;
  authorization?: SchemaAuthorizationType | null;
}

export function CreateSchemaSql(args: CreateSchemaArgs): QueryConfig {
  return sql`
    CREATE SCHEMA 
      ${IfNotExists(args.ifNotExists)}
      ${Identifier(args.schema)} 
      ${SchemaAuthorization(args.authorization)};
  `;
}
