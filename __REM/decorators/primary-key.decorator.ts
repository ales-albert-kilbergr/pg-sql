/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/ban-types */
import type * as Pg from '../model';
import { TableMetadata, metadata } from './table.metadata';

export type PrimaryKeyClassDecoratorArgs = Omit<
  Pg.TablePrimaryKeyConstraintArgs,
  'columns'
> & { constraintName?: string };

export type PrimaryKeyPropertyDecoratorArgs = PrimaryKeyClassDecoratorArgs & {
  columnName?: string;
};

/**
 * Define a primary key constraint on a table via property decorator.
 * The primary key property decorator allows to map the property key
 * to column name with `columnName` option or to set a custom constraint name.
 *
 * If not defined the constraint name will be `[table_name]_pkey`.
 *
 * If not specified the column name will be the property key.
 *
 * @example
 *
 * ```ts
 * class MyTable {
 *    @PrimaryKey()
 *    public id!: number;
 * }
 * ```
 *
 * or
 *
 * ```ts
 *
 * class MyOtherTable {
 *   @PrimaryKey({
 *      deferrable: true,
 *      columnName: 'my_id',
 *      constraintName: 'my_table_pkey'
 *   })
 *   public myId!: number;
 * }
 * ```
 */
export function PrimaryKey(
  args?: PrimaryKeyPropertyDecoratorArgs,
): PropertyDecorator;
/**
 * Define a primary key constraint on a table via property decorator. This
 * signature allows to define a custom constraint name. The primary key property
 * decorator allows to map the property key to column name with `columnName`
 * option.
 *
 * @example
 *
 * ```ts
 * class MyTable {
 *    @UniqueKey('my_custom_pkey_name')
 *    public myId!: number;
 * }
 * ```
 *
 * or
 *
 * ```ts
 * class MyTable {
 *    @UniqueKey('my_custom_pkey_name', { deferrable: true })
 *    public myId!: number;
 * }
 * ```
 */
export function PrimaryKey(
  constraintName: string,
  args?: Omit<PrimaryKeyPropertyDecoratorArgs, 'constraintName'>,
): PropertyDecorator;
/**
 * Define a primary key constraint on a table via class decorator. This signature
 * requires to specify all columns that should be part of the primary key. The
 * primary key will have a default constraint name which follows the pattern:
 * `[table_name]_pkey`.
 *
 *
 * @example
 *
 * ```ts
 * @UniqueKey(['id'], { deferred: true, constraintName: 'my_table_pkey' })
 * class MyTable {
 *   public id!: number;
 * }
 *
 */
export function PrimaryKey(
  columnNames: string[],
  args?: PrimaryKeyClassDecoratorArgs,
): ClassDecorator;

export function PrimaryKey(
  arg1?: string | string[] | PrimaryKeyPropertyDecoratorArgs,
  arg2?: PrimaryKeyClassDecoratorArgs | PrimaryKeyPropertyDecoratorArgs,
): ClassDecorator | PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    // Is Class Decorator - must list columns to which the primary key applies.
    if (typeof target === 'function' && Array.isArray(arg1)) {
      const { constraintName, ...otherArgs } = arg2 ?? {};

      TableMetadata.getMetadata(target).definePrimaryKey(
        {
          ...otherArgs,
          columns: arg1,
        },
        constraintName,
      );
    }
    // Is Property Decorator
    if (typeof target === 'object' && typeof propertyKey === 'string') {
      const constraintName =
        typeof arg1 === 'string' ? arg1 : arg2?.constraintName;
      const { columnName, ...otherProps }: PrimaryKeyPropertyDecoratorArgs =
        ((typeof arg1 === 'string' ? arg2 : arg1) ??
          {}) as PrimaryKeyPropertyDecoratorArgs;
      const args: Pg.TablePrimaryKeyConstraintArgs = {
        columns: [columnName ?? propertyKey],
        ...otherProps,
      };

      TableMetadata.getMetadata(target.constructor).definePrimaryKey(
        args,
        constraintName,
      );
    }
  };
}

PrimaryKey.metadata = metadata;
