import type { IUniqueConstraint, PrimaryKey } from '../model';
import type { ColumnList } from '../model/column';
import {
  Identifier,
  IfNotExists,
  PrimaryKeyConstraint,
  TableColumnDefinition,
} from '../nodes';
import { TableUniqueConstraintList } from '../nodes/table-unique-constraint-list/table-unique-constraint-list';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';

export interface CreateTableArgs {
  table: string;
  schema?: string;
  ifNotExists?: boolean;
  columns: ColumnList;
  primaryKey?: PrimaryKey;
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
        ${PrimaryKeyConstraint(args.primaryKey)}
        ${args.uniqueConstraints && args.uniqueConstraints.length > 0 ? ', ' : ''}
        ${TableUniqueConstraintList(args.uniqueConstraints)}
      );
      
  `;
}
