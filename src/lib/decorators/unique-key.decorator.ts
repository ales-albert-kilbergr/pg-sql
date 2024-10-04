/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/ban-types */
import type { TableUniqueConstraintArgs } from '../model';
import { TableMetadata, metadata } from './table.metadata';

export type UniqueKeyClassDecoratorArgs = Omit<
  TableUniqueConstraintArgs,
  'columns'
> & { constraintName?: string };

export type UniqueKeyPropertyDecoratorArgs = UniqueKeyClassDecoratorArgs & {
  columnName?: string;
};
/**
 * Define a unique key constraint on a table via property decorator.
 * The unique key property decorator allows to map the property key
 * to column name with `columnName` option or to set a custom constraint name.
 *
 * If not defined the constraint name will be `[table_name]_[column_name]_key`.
 *
 * If not specified the column name will be the property key.
 *
 * @example
 *
 * ```ts
 * class MyTable {
 *   @UniqueKey()
 *   public id!: number;
 * }
 * ```
 *
 * or
 *
 * ```ts
 * class MyOtherTable {
 *  @UniqueKey({
 *    deferrable: true,
 *    columnName: 'my_id',
 *    constraintName: 'my_table_unique_key'
 * })
 * public myId!: number;
 *}
 * ```
 */
export function UniqueKey(
  args?: UniqueKeyPropertyDecoratorArgs,
): PropertyDecorator;
/**
 * Define a unique key constraint on a table via class decorator. This
 * signature allows to define a custom constraint name. The unique key class
 * decorator allows to map the property key to column name with `columnName`
 * option.
 *
 * @example
 *
 * ```ts
 * class MyTable {
 *  @UniqueKey('my_table_id_unique_key')
 *  public id!: number;
 * }
 * ```
 *
 * or
 *
 * ```ts
 * class MyOtherTable {
 *   @UniqueKey('my_table_unique_key', { deferrable: true })
 *   public id!: number;
 * }
 */
export function UniqueKey(
  constraintName: string,
  args?: Omit<UniqueKeyClassDecoratorArgs, 'constraintName'>,
): PropertyDecorator;
/**
 * Define a unique key constraint on a table via class decorator. This
 * signature allows to define a custom constraint name.
 *
 * @example
 *
 * ```ts
 * @UniqueKey(['id'], { deferrable: true, constraintName: 'my_table_unique_key' })
 * class MyTable {
 *  public id!: number;
 * }
 */
export function UniqueKey(
  columnNames: string[],
  args?: UniqueKeyClassDecoratorArgs,
): ClassDecorator;

export function UniqueKey(
  arg1?: string | string[] | UniqueKeyPropertyDecoratorArgs,
  arg2?: UniqueKeyClassDecoratorArgs | UniqueKeyPropertyDecoratorArgs,
): ClassDecorator | PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    // Is Class Decorator
    if (typeof target === 'function' && Array.isArray(arg1)) {
      const { constraintName: name, ...otherArgs } = arg2 ?? {};

      TableMetadata.getMetadata(target).defineUniqueKey(
        {
          ...otherArgs,
          columns: arg1,
        },
        name,
      );
    }
    // Is Property Decorator
    if (typeof target === 'object' && typeof propertyKey === 'string') {
      const constraintName =
        typeof arg1 === 'string' ? arg1 : arg2?.constraintName;
      const { columnName, ...otherProps }: UniqueKeyPropertyDecoratorArgs =
        ((typeof arg1 === 'string' ? arg2 : arg1) ??
          {}) as UniqueKeyPropertyDecoratorArgs;
      TableMetadata.getMetadata(target.constructor).defineUniqueKey(
        {
          columns: [columnName ?? propertyKey],
          ...otherProps,
        },
        constraintName,
      );
    }
  };
}

UniqueKey.metadata = metadata;
