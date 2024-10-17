/* eslint-disable @typescript-eslint/max-params */
import { DatabaseObject } from '../../database-object';
import type { Table } from '../table';
import type {
  TablePartitionType,
  TablePartitionValues,
} from './table-partition-types';

export class TablePartition<
  T extends TablePartitionType,
> extends DatabaseObject<Table> {
  public type: T;
  /**
   * Column names or expressions
   */
  public values: TablePartitionValues<T>;

  public constructor(
    type: T,
    name: string,
    parent: Table,
    values: TablePartitionValues<T>,
  ) {
    super(name, parent);

    this.type = type;
    this.values = values;
  }

  public static isOf<T extends TablePartitionType>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partition: TablePartition<any>,
    type: T,
  ): partition is TablePartition<T> {
    return partition.type === type;
  }
}
