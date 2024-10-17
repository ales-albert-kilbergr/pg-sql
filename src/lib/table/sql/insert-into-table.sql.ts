import type { Table } from '../table';
import { escapeIdentifier } from 'pg';
import { getReturningSql, getSchemaQualifiedName } from '../../sql/common.sql';
import { formatSqlText } from '../../helpers';
import type { Column } from '../../column';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';

export class Args<V = object> {
  public into!: Table;

  public returning?: string | string[];

  public values!: V[];
}

export type Query<V = object> = SqlQueryWithArgs<Args<V>>;

export function getSql<V = object>(args: Args<V>): string {
  const schemaQualifiedName = getSchemaQualifiedName(args.into);
  const returningArr: string[] = !args.returning
    ? []
    : Array.isArray(args.returning)
      ? args.returning
      : [args.returning];
  const returningSql = getReturningSql(returningArr);
  const columns = Array.from(args.into.columns);
  const columnNames = columns.map((column) => escapeIdentifier(column.name));
  const rowsCount = args.values.length;

  const valuesSql: string[] = [];
  let bindingIndex = 1;
  for (let i = 0; i < rowsCount; i++) {
    const valuesRow = args.values[i];
    let row = '(';

    for (let j = 0; j < columns.length; j++) {
      const column = columns[j];
      const isDefault =
        Reflect.get(valuesRow as object, column.propertyKey) === undefined;
      if (!isDefault) {
        row += '$' + bindingIndex;
        bindingIndex++;
      } else {
        row += 'DEFAULT';
      }

      if (j !== columnNames.length - 1) {
        row += ', ';
      }
    }

    row += ')';

    valuesSql.push(row);
  }

  return formatSqlText(`
    INSERT INTO ${schemaQualifiedName} 
      (${columnNames.join(', ')}) VALUES ${valuesSql.join(', ')}
      ${returningSql};
  `);
}

export type MapDataIntoRowsColumnLike = Pick<Column, 'propertyKey' | 'type'>;

export function serializeValues<V = object>(args: Args<V>): unknown[] {
  const columns = Array.from(args.into.columns);
  const values: unknown[] = [];

  for (const row of args.values) {
    for (const column of columns) {
      const value: unknown = Reflect.get(row as object, column.propertyKey);
      if (value !== undefined) {
        values.push(column.type.serialize(value));
      }
    }
  }

  return values;
}

export function create<V = object>(table?: Table): Query<V> {
  const query = SqlQuery.from(Args<V>)
    .useSqlTextBuilder(getSql)
    .useValueSerializer(serializeValues);

  if (table) {
    query.into(table);
  }

  return query;
}
