import { Metadata } from '@kilbergr/metadata';
import { Table } from '../model';

const tableMetadata = new Metadata<Table>('sql:table');

function readTableFromMetatdata(target: Function): Table {
  const metadata = tableMetadata.get(target);

  if (!metadata) {
    tableMetadata.set(target, new Table());
  }

  return tableMetadata.get(target);
}
