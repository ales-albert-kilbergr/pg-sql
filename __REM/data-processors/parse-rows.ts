import type { QueryResultRow } from 'pg';
import type { Constructor } from 'type-fest';
import type { ColumnList } from '../model';

export interface TransformToInstanceArgs<T extends object> {
  columns: ColumnList;
  Ctor?: Constructor<T>;
}
/**
 * Transforms the rows to an array of instances of the specified class.
 *
 * @param ctor
 * @returns
 */
export function parseRows<T extends object>(args: TransformToInstanceArgs<T>) {
  return (rows: QueryResultRow[]): T[] => {
    const columnArr = args.columns.toArray();
    return rows.map((row) => {
      const instance = args.Ctor ? new args.Ctor() : {};

      for (const column of columnArr) {
        const value = row[column.name];
        if (value === undefined) {
          continue;
        }
        if (column.parse) {
          Reflect.set(
            instance as object,
            column.propertyKey,
            column.parse(value),
          );
        } else {
          Reflect.set(instance as object, column.propertyKey, value);
        }
      }
      return instance as T;
    });
  };
}
