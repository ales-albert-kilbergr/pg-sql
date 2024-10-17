import {
  DatabaseObject,
  DatabaseObjectList,
  type DatabaseObjectName,
} from '../database-object';
import type { Database } from '../database';
import { Table, type TableName } from '../table';
import type { Constructor } from 'type-fest';
import type { DataType, DataTypeDiscriminant } from '../data-type';
import { type AnySequenceType, Sequence } from '../model';
import { CreateSchemaSql, DropSchemaSql, SchemaExistsSql } from './sql';

export type SchemaName = DatabaseObjectName;

export interface SchemaOwnedPartialObject {
  name: string;
  schema: { name: string };
}

export class Schema extends DatabaseObject<Database> {
  public static DEFAULT_NAME: SchemaName = 'public' as SchemaName;

  public declare parent: Database;

  public tables = new DatabaseObjectList<Table>();

  public sequences = new DatabaseObjectList<Sequence<AnySequenceType>>();

  public get database(): Database {
    return this.parent;
  }

  public static Default(): Schema {
    return new Schema(Schema.DEFAULT_NAME);
  }

  public defineTable<T extends Table>(
    name: TableName,
    TableCtor: Constructor<T> = Table as Constructor<T>,
  ): T {
    const table = new TableCtor(name, this);

    this.tables.add(table);

    return table;
  }

  public defineSequence<
    T extends AnySequenceType = DataTypeDiscriminant.INTEGER,
  >(name: SchemaName, dataType?: DataType<T>): Sequence<T> {
    const type = dataType ?? this.database.dataTypes.getInt();
    const sequence = new Sequence<T>(name, this, type as DataType<T>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.sequences.add(sequence as any);

    return sequence;
  }

  public prepareCreateSql(): CreateSchemaSql.Query {
    return CreateSchemaSql.create(this);
  }

  public prepareDropSql(): DropSchemaSql.Query {
    return DropSchemaSql.create(this);
  }

  public prepareExistsSql(): SchemaExistsSql.Query {
    return SchemaExistsSql.create(this);
  }
}
