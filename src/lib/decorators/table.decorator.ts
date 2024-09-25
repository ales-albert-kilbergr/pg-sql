/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/ban-types */
import { Metadata } from '@kilbergr/metadata';
import { Table as TableModel } from '../model';

const metadata = new Metadata('pg:table');

function getTable(target: Function): TableModel {
  const table = metadata.get(target);

  if (table === undefined) {
    metadata.set(target, new TableModel());
  }

  return metadata.get(target) as TableModel;
}

export function Table(name: string): ClassDecorator {
  return (target: Function) => {
    const table = getTable(target);

    table.setName(name);
  };
}

Table.metadata = metadata;

Table.getTable = getTable;
