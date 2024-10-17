import type { Schema } from '../model';
/**
 * @see https://www.postgresql.org/docs/current/sql-dropschema.html
 */
export class DropSchemaCommand {
  public readonly schema: Schema;

  public ifExists = false;

  public cascade = false;

  public constructor(schema: Schema) {
    this.schema = schema;
  }
}
