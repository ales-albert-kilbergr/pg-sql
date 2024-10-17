import type {
  Pool,
  PoolClient,
  QueryConfig,
  QueryResult,
  QueryResultRow,
} from 'pg';
import type { InvalidArgsException } from '../args';
import type { SqlQuery, SqlQueryClient } from '../sql-query';
import type { Either } from 'fp-ts/Either';

export class SqlTransaction implements SqlQueryClient {
  private readonly pool: Pool;

  private client?: PoolClient;

  public constructor(pool: Pool) {
    this.pool = pool;
  }

  public async begin(): Promise<void> {
    if (this.client) {
      throw new Error('Transaction already started');
    }
    this.client = await this.pool.connect();

    await this.client.query('BEGIN');
  }

  public async commit(): Promise<void> {
    if (!this.client) {
      throw new Error('Transaction not started');
    }

    await this.client.query('COMMIT');
    this.client.release();

    this.client = undefined;
  }

  public async rollback(): Promise<void> {
    if (!this.client) {
      throw new Error('Transaction not started');
    }

    await this.client.query('ROLLBACK');
    this.client.release();

    this.client = undefined;
  }

  public getClientOrFail(): PoolClient {
    if (!this.client) {
      throw new Error('Transaction not started');
    }

    return this.client;
  }

  public async execute<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
    QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    query: SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    if (!this.client) {
      throw new Error('Transaction not started');
    }

    return query.execute(this.client);
  }

  public async query<R extends QueryResultRow = QueryResultRow>(
    queryConfig: string | QueryConfig,
  ): Promise<QueryResult<R>> {
    if (!this.client) {
      throw new Error('Transaction not started');
    }

    return this.client.query<R>(queryConfig);
  }
}
