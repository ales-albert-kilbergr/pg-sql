import type { Table } from '../model';
import {
  CreateSchemaStatement,
  CreateTableStatement,
  TableExistsStatement,
} from '../statements';

export class TableRepository {
  public readonly table: Table;

  public createTable: CreateTableStatement;

  public tableExists: TableExistsStatement;

  public createSchema: CreateSchemaStatement;

  public constructor(table: Table) {
    this.table = table;

    this.createTable = new CreateTableStatement().table(table).ifNotExists();

    this.tableExists = new TableExistsStatement().table(table);

    this.createSchema = new CreateSchemaStatement(table.schema).ifNotExists();
  }
}
