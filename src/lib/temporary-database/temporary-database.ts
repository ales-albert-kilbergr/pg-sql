import { stringRandom } from '@kilbergr/string';
import { Database } from '../model';
import { type ClientBase, Pool, type PoolConfig } from 'pg';
import type {
  PreparedCreateDatabaseCommand,
  PreparedDropDatabaseCommand,
} from '../database';

export interface TemporaryDatabaseMigration {
  // We always run the migration up only
  up: (client: ClientBase) => Promise<void>;
}

export class TemporaryDatabase {
  public static readonly DEFAULT_PORT = 5432;

  /**
   * The database object for the temporary database.
   */
  public readonly database: Database;

  private readonly createDatabase: PreparedCreateDatabaseCommand;

  private readonly dropDatabase: PreparedDropDatabaseCommand;

  private readonly tempDatabaseConfig: PoolConfig;

  private readonly adminDatabase: Database;

  public constructor(tempDatabaseName: string, adminConfig: PoolConfig) {
    if (!adminConfig.user) {
      throw new Error('User must be specified in the pool config.');
    }

    this.tempDatabaseConfig = {
      ...adminConfig,
      database: tempDatabaseName,
    };

    this.database = new Database(
      tempDatabaseName,
      new Pool(this.tempDatabaseConfig),
    );

    this.adminDatabase = new Database(
      adminConfig.database ?? 'postgres',
      new Pool(adminConfig),
    );

    this.createDatabase = this.adminDatabase
      .prepareCreateDatabaseCommand()
      .withOwner(adminConfig.user);

    this.dropDatabase = this.adminDatabase
      .prepareDropDatabaseCommand()
      .withForce(true);
  }

  public static createRandomDatabaseName(prefix?: string): string {
    return `${prefix ?? 'test'}_${stringRandom()}`.toLowerCase();
  }

  public static configFromEnv(): PoolConfig {
    const host = process.env.POSTGRES_TESTING_HOST;

    if (!host) {
      throw new Error('POSTGRES_TESTING_HOST is not set.');
    }

    const user = process.env.POSTGRES_TESTING_USERNAME;

    if (!user) {
      throw new Error('POSTGRES_TESTING_USERNAME is not set.');
    }

    const password = process.env.POSTGRES_TESTING_PASSWORD;

    if (!password) {
      throw new Error('POSTGRES_TESTING_PASSWORD is not set.');
    }

    const port = process.env.POSTGRES_TESTING_PORT
      ? Number(process.env.POSTGRES_TESTING_PORT)
      : TemporaryDatabase.DEFAULT_PORT;

    return { host, port, user, password };
  }

  public static fromEnv(prefix?: string): TemporaryDatabase {
    return new TemporaryDatabase(
      TemporaryDatabase.createRandomDatabaseName(prefix),
      TemporaryDatabase.configFromEnv(),
    );
  }

  /**
   * Creates the temporary database.
   */
  public async init(): Promise<void> {
    await this.adminDatabase.execute(this.createDatabase);
  }
  /**
   * Access low level PG pool for testing database.
   */
  public getPoolOrFail(): Pool {
    const pool = this.database.getPool();
    if (!pool) {
      throw new Error(
        'Temporary database is not initialized yet. Call init() first.',
      );
    }
    return pool;
  }
  /**
   * Prepare database for testing by creating all necessary tables and schemas.
   *
   * The migration always run the `up` method of the migration only and does not
   * keep track of the migration history. The migration also does not care about
   * concurrent instances running the migration at the same time. We assume that
   * the migration runs on an adhoc created database which will be dropped after
   * the tests. The database is supposed to be created for one test suite only.
   *
   * @param config
   */
  public async runMigration(
    migrations: TemporaryDatabaseMigration[],
  ): Promise<void> {
    // We suppose that the migration runs on an adhoc created database which will
    // be dropped after the tests. Therefore we do not need to keep track of a
    // migration history or to make sure that concurrent instances are not
    // attempting to run the migrations at the same time.
    // For those reasons we will not use any migration runner library but will
    // go with a simple implementation here.

    const client = await this.getPoolOrFail().connect();

    try {
      await client.query('BEGIN');

      for (const migration of migrations) {
        await migration.up(client);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  /**
   * Drops the temporary database.
   */
  public async close(): Promise<void> {
    const tempDatabasePool = this.database.getPool();

    if (tempDatabasePool) {
      // Disconnect the pool before shutting dropping the testing database.
      // The database drop will forcefully end all connection to it which could
      // trigger an error.
      await tempDatabasePool.end();
    }

    await this.adminDatabase.execute(this.dropDatabase);
  }
}
