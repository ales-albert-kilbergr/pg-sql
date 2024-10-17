import type { ColumnList } from '../model/column';
import { Identifier, InsertColumns, InsertValues, Returning } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface InsertArgs<D extends object = object> {
  data: D | D[];
  schema: string;
  table: string;
  columns: ColumnList;
  returning?: string | string[];
}

export function InsertSql<D extends object>(args: InsertArgs<D>): QueryConfig {
  const dataArray = Array.isArray(args.data) ? args.data : [args.data];
  const returningArr =
    args.returning !== undefined
      ? Array.isArray(args.returning)
        ? args.returning
        : [args.returning]
      : void 0;

  function transformKey(propertyKey: string): string {
    return args.columns.getColumnName(propertyKey);
  }

  const columns = args.columns.getPropertyKeys();

  return sql`
    INSERT INTO ${Identifier(`${args.schema}.${args.table}`)}
    ${InsertColumns(columns, { transformKey })}
    ${InsertValues(dataArray, { columns })}
    ${Returning(returningArr)};
  `;
}
