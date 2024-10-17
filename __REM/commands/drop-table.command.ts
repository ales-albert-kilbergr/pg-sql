import type { Table } from '../model';
/**
 * @see https://www.postgresql.org/docs/current/sql-dropstable.html
 */
export class DropTableCommand {
  public readonly table: Table;

  public ifExists = false;

  public cascade = false;

  public constructor(schema: Table) {
    this.table = schema;
  }
}
