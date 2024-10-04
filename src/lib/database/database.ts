import { DataTypeRegistry } from '../data-type';
import { DatabaseObject, DatabaseObjectList } from '../database-object';
import { Schema } from '../schema';
import type {
  Pool,
  QueryConfig,
  QueryResultRow,
  QueryResult,
  PoolClient,
} from 'pg';
import {
  type PreparedSqlCommand,
  SqlCommand,
  SqlCommandRunner,
  SqlCommandTransactionRunner,
} from '../commands';
import {
  prepareCreateDatabaseCommand,
  type PreparedCreateDatabaseCommand,
} from './create-database';
import {
  type PreparedDropDatabaseCommand,
  prepareDropDatabaseCommand,
} from './drop-database';
import type { Either } from 'fp-ts/Either';
import type { InvalidArgsException } from '../args';

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

  public async transaction<R = unknown>(
    clb: (client: PoolClient) => Promise<R>,
  ): Promise<R> {
    if (!this.pool) {
      throw new Error('Pool is not set!');
    }

    const client = await this.pool.connect();
    const runner = new SqlCommandTransactionRunner(client);

    try {
      await runner.startTransaction();

      const result = await clb(client);

      await runner.commitTransaction();

      return result;
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  public createCommandRunner(): SqlCommandRunner {
    return new SqlCommandRunner(this);
  }

  public async execute<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
  >(
    arg:
      | SqlCommand<ARGS, RESULT, ERROR>
      | PreparedSqlCommand<ARGS, RESULT, ERROR>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    const commandRunner = this.createCommandRunner();

    const command = arg instanceof SqlCommand ? arg : arg.create();

    return commandRunner.execute<ARGS, RESULT, ERROR>(command);
  }

  public prepareCreateDatabaseCommand(): PreparedCreateDatabaseCommand {
    return prepareCreateDatabaseCommand(this);
  }

  public prepareDropDatabaseCommand(): PreparedDropDatabaseCommand {
    return prepareDropDatabaseCommand(this);
  }
}
