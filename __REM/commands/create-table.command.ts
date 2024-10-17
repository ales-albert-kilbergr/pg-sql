import type { Table } from '../model';

export class CreateTableCommand {
  public ifNotExists = false;

  public table: Table;

  public constructor(table: Table) {
    this.table = table;
  }
}
