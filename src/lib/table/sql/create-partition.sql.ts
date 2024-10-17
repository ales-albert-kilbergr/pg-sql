import { escapeIdentifier } from 'pg';
import { getIfNotExistsSql } from '../../sql';
import type { Table } from '../table';
import {
  TablePartition,
  TablePartitionType,
  type TablePartitionValues,
} from '../table-partition';
import { SqlQuery, type SqlQueryWithArgs } from '../../sql-query';
// No available types for prepareValue in pg
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { prepareValue } = require('pg/lib/utils');

export class Args<T extends TablePartitionType> {
  public ifNotExists = false;

  public table!: Table;

  public partition!: TablePartition<T>;
}

export type Query<T extends TablePartitionType> = SqlQueryWithArgs<Args<T>>;

export function getSql<T extends TablePartitionType>({
  ifNotExists,
  table,
  partition,
}: Args<T>): string {
  const ifNotExistsSql = getIfNotExistsSql(ifNotExists);
  const tableName = `${escapeIdentifier(table.schema.name)}.${escapeIdentifier(
    table.name,
  )}`;
  const partitionName = escapeIdentifier(partition.name);

  let partitionValuesSql = '';

  if (TablePartition.isOf(partition, TablePartitionType.LIST)) {
    const { values } =
      partition.values as TablePartitionValues<TablePartitionType.LIST>;
    // No SQL binding is possible for the values in list. Therefore a simple
    // string is returned.
    partitionValuesSql = `IN (${values.map(prepareValue).join(', ')})`;
  } else if (TablePartition.isOf(partition, TablePartitionType.RANGE)) {
    const { from, to } =
      partition.values as TablePartitionValues<TablePartitionType.RANGE>;
    partitionValuesSql = `FROM (${prepareValue(from)}) TO (${prepareValue(to)})`;
  } else if (TablePartition.isOf(partition, TablePartitionType.HASH)) {
    const { modulus, remainder } =
      partition.values as TablePartitionValues<TablePartitionType.HASH>;
    partitionValuesSql = `WITH (MODULUS ${modulus}, REMINDER ${remainder})`;
  } else {
    throw new Error(`Unsupported partition type "${partition.type}"`);
  }

  return `
    CREATE TABLE ${ifNotExistsSql} ${partitionName}
    PARTITION OF ${tableName}
    FOR VALUES ${partitionValuesSql}
  `;
}

export function create<T extends TablePartitionType>(table?: Table): Query<T> {
  const query = SqlQuery.from(Args<T>).useSqlTextBuilder(getSql);

  if (table) {
    query.table(table);
  }

  return query;
}
