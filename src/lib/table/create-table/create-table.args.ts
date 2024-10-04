import type { Table } from '../table';

export class CreateTableArgs {
  public table!: Table;

  public ifNotExists = false;
}
