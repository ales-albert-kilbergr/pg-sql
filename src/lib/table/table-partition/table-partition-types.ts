import type { ColumnName } from '../../column';
import type { DatabaseObjectName } from '../../database-object';
import type { Table } from '../table';

export enum TablePartitionType {
  RANGE = 'RANGE',
  LIST = 'LIST',
  HASH = 'HASH',
}

// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
export type TablePartitionExpression = ColumnName | string;

export type TablePartitionName = DatabaseObjectName;

export type TablePartitionNameBuilder<T extends TablePartitionType> = (
  type: T,
  partitionKey: TablePartitionKey<T>,
  table: Table,
) => TablePartitionName;

//export interface TablePartitionKey

export interface ColumnNameOrExpression {
  /**
   * A discriminant to determine if the value has to be understood as an
   * expression or a column name.
   */
  kind: 'expression' | 'column';
  /**
   * An expression or column name.
   *
   * An expression can be used for example to define the partition key with
   * an built-in function like `EXTRACT` or `TO_CHAR`.
   *
   * ```
   * PARTITION BY LIST (EXTRACT(YEAR FROM logdate));
   * ```
   */
  value: string;
}

export interface HashPartitionKey {
  /**
   * The postgres database supports at maximum 32 column names or expressions
   * for the hash partition key.
   */
  fragments: ColumnNameOrExpression[];
}

export interface RangePartitionKey {
  /**
   * The postgres database supports at maximum 32 column names or expressions
   * for the range partition key.
   */
  fragments: ColumnNameOrExpression[];
}
/**
 * The list partition key can oly define one column or expression.
 */
export interface ListPartitionKey {
  /**
   * The column name or expression to define the list partition key. The
   * postgres supports only one column or expression for the list partition key.
   */
  fragment: ColumnNameOrExpression;
}

export type TablePartitionKey<T extends TablePartitionType> =
  T extends TablePartitionType.HASH
    ? HashPartitionKey
    : T extends TablePartitionType.RANGE
      ? RangePartitionKey
      : ListPartitionKey;

export interface ListPartitionValues<V> {
  values: V[];
}

export interface RangePartitionValues<V> {
  from: V;
  to: V;
}

export interface HashPartitionValues {
  modulus: number;
  remainder: number;
}

export type TablePartitionValues<
  T extends TablePartitionType,
  V = string,
> = T extends TablePartitionType.HASH
  ? HashPartitionValues
  : T extends TablePartitionType.RANGE
    ? RangePartitionValues<V>
    : ListPartitionValues<V>;
