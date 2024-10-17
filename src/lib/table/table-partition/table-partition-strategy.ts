/* eslint-disable @typescript-eslint/max-params */
import { DatabaseObjectList } from '../../database-object';
import type { Table } from '../table';
import { TablePartition } from './table-partition';
import type {
  TablePartitionKey,
  TablePartitionName,
  TablePartitionNameBuilder,
  TablePartitionType,
  TablePartitionValues,
} from './table-partition-types';

export class TablePartitionStrategy<T extends TablePartitionType> {
  /**
   * Partition type (RANGE, LIST, HASH). Each type has its own rules
   * for partitioning.
   */
  public type: T;
  /**
   * The partitioning is based either on column names or expressions.
   */
  public key: TablePartitionKey<T>;

  public readonly partitions: DatabaseObjectList<TablePartition<T>>;

  private readonly partitionNameBuilder: TablePartitionNameBuilder<T>;

  private readonly table: Table;

  public constructor(
    type: T,
    key: TablePartitionKey<T>,
    partitionNameBuilder: TablePartitionNameBuilder<T>,
    table: Table,
  ) {
    this.type = type;
    this.key = key;
    this.table = table;
    this.partitionNameBuilder = partitionNameBuilder;

    this.partitions = new DatabaseObjectList();
  }

  public getPartitionName(): TablePartitionName {
    return this.partitionNameBuilder(this.type, this.key, this.table);
  }

  public definePartition(
    partitionValues: TablePartitionValues<T>,
  ): TablePartition<T> {
    const tablePartition = new TablePartition<T>(
      this.type,
      this.getPartitionName(),
      this.table,
      partitionValues,
    );
    this.partitions.add(tablePartition);

    return tablePartition;
  }
}
