import { escapeIdentifier } from 'pg';
import type { identifier } from '../identifier';
import { DatabaseObject } from '../database-object/database-object';
import type { Database } from '../database';
import { Table } from '../table/table';
import { DatabaseObjectList } from '../database-object/database-object-list';

export class Schema extends DatabaseObject<Database> {
  public static DEFAULT_SCHEMA_NAME: identifier = 'public' as identifier;

  public declare parent: Database;

  public tables = new DatabaseObjectList<Table>();

  public get database(): Database {
    return this.parent;
  }
  /**
   * Override the getFullName method to return only the name of the schema.
   * We don't need to include the name of the database in the full name of the schema
   * or it's children.
   *
   * @returns The name of the schema.
   */
  public override get fullName(): string {
    return this.name;
  }
  /**
   *
   * @returns The name of the schema escaped.
   */
  public override get escapedFullName(): string {
    return escapeIdentifier(this.name);
  }

  public static Default(): Schema {
    return new Schema(Schema.DEFAULT_SCHEMA_NAME);
  }

  public defineTable(name: identifier): Table {
    const table = new Table(name, this);

    this.tables.add(table);

    return table;
  }
}
