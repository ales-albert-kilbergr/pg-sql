import { Cascade, Identifier, IfExists } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface DropTableArgs {
  schema: string;
  table: string;
  ifExists?: boolean;
  cascade?: boolean;
}

export function DropTableSql(args: DropTableArgs): QueryConfig {
  return sql`
    DROP TABLE 
      ${IfExists(args.ifExists)}
      ${Identifier(`${args.schema}.${args.table}`)} 
      ${Cascade(args.cascade)};
  `;
}
