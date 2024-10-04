/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { TableMetadata, metadata } from './table.metadata';

export function Table(name: string): ClassDecorator {
  return (target: Function) => {
    TableMetadata.getMetadata(target).defineTable(name);
  };
}

Table.metadata = metadata;
