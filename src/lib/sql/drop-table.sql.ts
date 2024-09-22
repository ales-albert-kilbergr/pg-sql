import { Cascade, Identifier, IfExists } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export declare namespace DropTable {
  interface Args {
    schema: string;
    table: string;
    ifExists?: boolean;
    cascade?: boolean;
  }
}

export function DropTable(args: DropTable.Args): QueryConfig {
  return sql`
    DROP TABLE 
      ${IfExists(args.ifExists)}
      ${Identifier(`${args.schema}.${args.table}`)} 
      ${Cascade(args.cascade)};
  `;
}
