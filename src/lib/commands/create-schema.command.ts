import type { Schema } from '../model';

export class CreateSchemaCommand {
  public ifNotExists = false;

  public schema: Schema;

  public authorization?: string;

  public constructor(schema: Schema) {
    this.schema = schema;
  }
}
