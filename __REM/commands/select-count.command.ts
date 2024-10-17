import type { Table } from '../model';

export class SelectCountCommand {
  public table: Table;

  public constructor(table: Table) {
    this.table = table;
  }
}
