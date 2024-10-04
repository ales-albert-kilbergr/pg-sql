import type { QueryResult, QueryResultRow } from 'pg';
import type { InvalidArgsException } from '../args';
import type { SqlCommand } from '.';
import { SqlCommandRunner } from './command-runner';
import { isLeft, type Either } from 'fp-ts/Either';

export class SqlCommandTransactionRunner extends SqlCommandRunner {
  public async startTransaction(): Promise<void> {
    await this.client.query('BEGIN');
  }

  public async commitTransaction(): Promise<void> {
    await this.client.query('COMMIT');
  }

  public async rollbackTransaction(): Promise<void> {
    await this.client.query('ROLLBACK');
  }

  public async execute<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
    QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    command: SqlCommand<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    const result = await super.execute(command);

    if (isLeft(result)) {
      await this.rollbackTransaction();
    }

    return result;
  }
}
