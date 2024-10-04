import type { Table } from '../table';

export class InsertArgs {
  public table!: Table;

  public returning?: string[];

  public rowsCount?: number;
}
