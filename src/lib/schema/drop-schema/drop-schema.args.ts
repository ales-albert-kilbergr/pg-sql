import type { Schema } from '../schema';

export class DropSchemaArgs {
  public schema!: Schema;

  public ifExists = false;

  public cascade = false;
}
