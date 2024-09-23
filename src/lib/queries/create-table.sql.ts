import type { IUniqueConstraint } from '../model';
import type { ColumnList } from '../model/column';
import {
  Identifier,
  IfNotExists,
  PrimaryKey,
  type PrimaryKeyArgs,
  TableColumnDefinition,
} from '../nodes';
import { TableUniqueConstraintList } from '../nodes';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface CreateTableArgs {
  table: string;
  schema?: string;
  ifNotExists?: boolean;
  columns: ColumnList;
  primaryKey?: Omit<PrimaryKeyArgs, 'table'>;
  uniqueConstraints?: IUniqueConstraint[];
}

export function CreateTableSql(args: CreateTableArgs): QueryConfig {
  const schema = args.schema ?? 'public';

  return sql`
    CREATE TABLE 
      ${IfNotExists(args.ifNotExists)} 
      ${Identifier(`${schema}.${args.table}`)} 
      (
        ${TableColumnDefinition(args.columns)}
        ${args.primaryKey ? ', ' : ''}
        ${PrimaryKey({ ...args.primaryKey, table: args.table })}
        ${args.uniqueConstraints && args.uniqueConstraints.length > 0 ? ', ' : ''}
        ${TableUniqueConstraintList(args.uniqueConstraints)}
      );
      
  `;
}
