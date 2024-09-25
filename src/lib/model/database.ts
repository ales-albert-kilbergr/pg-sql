import { DataTypeRegistry } from './data-type';
import { DatabaseObject, DatabaseObjectList } from './database-object';
import type { identifier } from './identifier';
import { Schema } from './schema';

export class Database extends DatabaseObject {
  public readonly dataTypes = new DataTypeRegistry();

  public readonly schemas = new DatabaseObjectList<Schema>();

  public constructor(name: identifier) {
    super(name);

    this.defineSchema(Schema.DEFAULT_SCHEMA_NAME);
  }

  public defineSchema(name: identifier): Schema {
    const schema = new Schema(name, this);
    this.schemas.add(schema);
    return schema;
  }

  public getDefaultSchema(): Schema {
    const defaultSchema = this.schemas.get(Schema.DEFAULT_SCHEMA_NAME);

    if (!defaultSchema) {
      throw new Error('Default schema not found');
    }

    return defaultSchema;
  }
}
