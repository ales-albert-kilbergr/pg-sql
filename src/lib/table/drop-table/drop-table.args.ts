import type { Table } from '../table';

export class DropTableArgs {
  public table!: Table;

  public ifExists = false;

  public cascade = false;
}
