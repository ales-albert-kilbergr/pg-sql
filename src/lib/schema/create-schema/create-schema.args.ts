import type { Schema } from '../schema';

export class CreateSchemaArgs {
  public schema!: Schema;
  public ifNotExists = false;
  public authorization?: string;
}
