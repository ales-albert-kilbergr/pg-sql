import type { QueryResult, QueryResultRow } from 'pg';
import type { SqlCommand, SqlCommandClient } from '.';
import { type Either, left, right, isLeft } from 'fp-ts/Either';
import type { InvalidArgsException } from '../args';

export class SqlCommandRunner {
  protected client: SqlCommandClient;

  public constructor(client: SqlCommandClient) {
    this.client = client;
  }

  public async execute<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
    QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    command: SqlCommand<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    const args = await command.args.build();

    if (isLeft(args)) {
      return args;
    }

    const sqlText = command.getSql(args.right);
    const sqlValues = command.serializeValues(args.right);
    const queryConfig = command.buildQueryConfig(sqlText, sqlValues);

    try {
      const queryResult =
        await this.client.query<QUERY_RESULT_ROW>(queryConfig);

      const parsedResult = command.parseResult(
        queryResult,
        queryConfig,
        args.right,
      );

      return right(parsedResult);
    } catch (error) {
      const matchedError = command.matchError(error, queryConfig, args.right);

      return left(matchedError);
    }
  }
}
