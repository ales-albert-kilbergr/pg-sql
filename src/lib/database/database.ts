import { DataTypeRegistry } from '../data-type';
import { DatabaseObject, DatabaseObjectList } from '../database-object';
import { Schema } from '../schema';
import type { Pool, QueryConfig, QueryResultRow, QueryResult } from 'pg';
import type { SqlQuery } from '../sql-query';
import type { Either } from 'fp-ts/Either';
import type { InvalidArgsException } from '../args';
import { SqlTransaction } from './transaction';
import { CreateDatabaseSql, DropDatabaseSql } from './sql';

export class Database extends DatabaseObject {
  public static DEFAULT_NAME = 'default';

  public readonly dataTypes = new DataTypeRegistry();

  public readonly schemas = new DatabaseObjectList<Schema>();

  private pool?: Pool;

  public constructor(name: string, pool?: Pool) {
    super(name);

    this.pool = pool;

    this.defineSchema(Schema.DEFAULT_NAME);
  }

  public getPool(): Pool | undefined {
    return this.pool;
  }

  public setPool(pool: Pool): void {
    this.pool = pool;
  }

  public async query<R extends QueryResultRow>(
    queryConfig: QueryConfig,
  ): Promise<QueryResult<R>> {
    if (!this.pool) {
      throw new Error('Pool is not set!');
    }

    const client = await this.pool.connect();

    try {
      const result = await client.query(queryConfig);

      return result;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  public defineSchema(name: string): Schema {
    const schema = new Schema(name, this);
    this.schemas.add(schema);
    return schema;
  }

  public getDefaultSchema(): Schema {
    const defaultSchema = this.schemas.get(Schema.DEFAULT_NAME);

    if (!defaultSchema) {
      throw new Error('Default schema not found');
    }

    return defaultSchema;
  }

  public async acquireAdvisoryLock(lockId: number): Promise<void> {
    await this.query({
      text: 'SELECT pg_advisory_lock($1);',
      values: [lockId],
    });
  }

  public async releaseAdvisoryLock(lockId: number): Promise<void> {
    await this.query({
      text: 'SELECT pg_advisory_unlock($1);',
      values: [lockId],
    });
  }

  public prepareTransaction(): SqlTransaction {
    if (!this.pool) {
      throw new Error('Pool is not set!');
    }

    return new SqlTransaction(this.pool);
  }

  public async execute<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
  >(
    query: SqlQuery<ARGS, RESULT, ERROR>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    if (!this.pool) {
      throw new Error('Pool is not set!');
    }

    return query.execute(this.pool);
  }

  public prepareCreateSql(): CreateDatabaseSql.Query {
    return CreateDatabaseSql.create(this);
  }

  public prepareDropSql(): DropDatabaseSql.Query {
    return DropDatabaseSql.create(this);
  }
}
