export class TableCreationFailedException extends Error {
  public readonly table: string;

  public readonly origError: Error;

  public readonly sql: string;

  public constructor(table: string, sql: string, origError: Error) {
    super(`Failed to create table: ${table}. ${origError.message}`);

    this.table = table;
    this.origError = origError;
    this.sql = sql;
  }
}
