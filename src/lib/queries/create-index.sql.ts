import { Concurrently, Identifier, IfNotExists, Only, Unique } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface CreateIndexSqlArgs {
  schema: string;
  table: string;
  ifNotExists?: boolean;
  name: string;
  indexedNames: string[];
  unique?: boolean;
  concurrently?: boolean;
  only?: boolean;
  using?: 'btree' | 'hash' | 'gist' | 'spgist' | 'gin' | 'brin';
}

const DEFAULT_USING = 'btree';

export function CreateIndexSql(args: CreateIndexSqlArgs): QueryConfig {
  return sql`
    CREATE ${Unique(args.unique)} INDEX 
      ${Concurrently(args.concurrently)} 
      ${IfNotExists(args.ifNotExists)} ${Identifier(args.name)}
      ON ${Only(args.only)} ${Identifier(args.schema)}.${Identifier(args.table)}
      USING ${args.using ?? DEFAULT_USING}
      (${Identifier(args.indexedNames)});
  `;
}
