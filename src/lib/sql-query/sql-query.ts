/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { QueryResult, QueryConfig, QueryResultRow } from 'pg';
import { type Either, left, right, isLeft } from 'fp-ts/Either';
import type {
  SqlQueryClient,
  SqlErrorMatcher,
  SqlResultParser,
  SqlTextBuilder,
  SqlValueSerializer,
} from './sql-query.types';
import {
  ArgsMap,
  createArgsAccessor,
  type InvalidArgsException,
  type WithArgsAccessors,
  type WithArgsMap,
} from '../args';
import type { Constructor } from 'type-fest';

export type SqlQueryWithArgs<
  ARGS extends object,
  RESULT = QueryResult,
  ERROR = never,
  QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
> = WithArgsAccessors<ARGS, SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>>;

/**
 * The `SqlCommand` is a class which represents an sql statement ready to be
 * executed and processed. The command takes care of building the sql query,
 * serializing the values, parsing the result and matching the error.
 *
 * There is a difference between SqlCommand and PreparedSqlCommand. The PreparedSqlCommand
 * is like a template with preset static arguments, which can be used to create
 * many instances of a specific SqlCommand with different dynamic arguments.
 *
 * We can have PreparedInsertCommand with preset table, data processing
 * pipeline and error matching strategy and then create on each occasion an
 * InsertCommand and provide custom values to it. SqlCommand always allows to
 * override all static arguments inherited from the PreparedSqlCommand.
 *
 * The sql query is built by using a series of get[Something]Sql pure functions,
 * which can be memoized and tested in isolation.
 *
 * ## Postgres Client
 *
 * The Sql reads the client by default from its database
 *
 *
 *
 * An executable SQL command.
 *
 * Each command execution has the following steps:
 *  - Build the SQL query
 *  - Parse the values
 *  - Build a query config
 *  - Execute the query
 *  - Parse the result
 *  - match the error
 *
 *
 * List of sql commands:
 * @see https://www.postgresql.org/docs/current/sql-commands.html
 */
export class SqlQuery<
  ARGS extends object,
  RESULT = QueryResult,
  ERROR = never,
  QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
> implements WithArgsMap<ARGS>
{
  public readonly args: ArgsMap<ARGS>;
  /**
   * A strategy which is responsible to build the sql
   * for a sql command. The function receives merged of prepared and instance
   * arguments and returns the sql text.
   *
   * Because the function and its nested helpers are supposed to be pure, the
   * memoization is a good practice to avoid unnecessary calculations.
   */
  private sqlTextBuilder?: SqlTextBuilder<ARGS>;
  /**
   * The sql value serializer is responsible for extracting the sql values from
   * the command arguments and convert them into an array of values for the
   * query config. The values MUST be sometimes also serialized to fit the
   * sql syntax. For example bigints or dates must be stringified.
   *
   * The proper way to serialize specific values is to use their respective
   * column data types which implements parse and serialize methods.
   *
   * The result is an array of values for the query config.
   *
   * The sql value serialize is optional. If not provided, no values will be
   * provided to the query config. (e.g. for a command without values)
   */
  private valueSerializer?: SqlValueSerializer<ARGS>;

  private resultParser?: SqlResultParser<RESULT, ARGS, QUERY_RESULT_ROW>;

  private errorMatcher?: SqlErrorMatcher<ERROR, ARGS>;
  /**
   *
   * @param preparedArgs
   * @param sqlBuilder a strategy which is responsible to build the sql
   *   for a sql command. The function receives merged of prepared and instance
   *   arguments and returns the sql text.
   * @param client
   */
  public constructor(argsMap: ArgsMap<ARGS>) {
    this.args = argsMap;
  }

  public static from<
    ARGS extends object,
    RESULT = QueryResult,
    ERROR = never,
    QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    ArgsCtor: Constructor<ARGS>,
    initArgs?: Partial<ARGS>,
  ): SqlQueryWithArgs<ARGS, RESULT, ERROR, QUERY_RESULT_ROW> {
    const argsMap = new ArgsMap<ARGS>(ArgsCtor, initArgs);

    const sqlCommand = new SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>(
      argsMap,
    );

    const sqlCommandWithArgsAccessors = createArgsAccessor<
      ARGS,
      SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>
    >(sqlCommand);

    return sqlCommandWithArgsAccessors;
  }

  public clone(): SqlQueryWithArgs<ARGS, RESULT, ERROR, QUERY_RESULT_ROW> {
    const sqlQuery = createArgsAccessor<
      ARGS,
      SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>
    >(new SqlQuery<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>(this.args.clone()));

    sqlQuery.sqlTextBuilder = this.sqlTextBuilder;
    sqlQuery.valueSerializer = this.valueSerializer;
    sqlQuery.resultParser = this.resultParser;
    sqlQuery.errorMatcher = this.errorMatcher;

    return sqlQuery;
  }

  public useResultParser<
    NEW_RESULT,
    NEW_QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    resultParser: SqlResultParser<NEW_RESULT, ARGS, NEW_QUERY_RESULT_ROW>,
  ): WithArgsAccessors<
    ARGS,
    SqlQuery<ARGS, NEW_RESULT, ERROR, NEW_QUERY_RESULT_ROW>
  > {
    const self = this as unknown as WithArgsAccessors<
      ARGS,
      SqlQuery<ARGS, NEW_RESULT, ERROR, NEW_QUERY_RESULT_ROW>
    >;

    self.resultParser = resultParser;

    return self;
  }

  public useErrorMatcher<NEW_ERROR>(
    errorMatcher: SqlErrorMatcher<NEW_ERROR, ARGS>,
  ): WithArgsAccessors<
    ARGS,
    SqlQuery<ARGS, RESULT, NEW_ERROR, QUERY_RESULT_ROW>
  > {
    const self = this as unknown as WithArgsAccessors<
      ARGS,
      SqlQuery<ARGS, RESULT, NEW_ERROR, QUERY_RESULT_ROW>
    >;
    self.errorMatcher = errorMatcher;

    return self;
  }

  public useValueSerializer(
    valueSerializer: SqlValueSerializer<ARGS>,
  ): WithArgsAccessors<ARGS, this> {
    this.valueSerializer = valueSerializer;

    return this as unknown as WithArgsAccessors<ARGS, this>;
  }
  /**
   * Set a custom sql builder for the command. This is useful to provide a
   * custom sql builder for the command.
   *
   * @param sqlBuilder
   * @returns this
   */
  public useSqlTextBuilder(
    sqlBuilder: SqlTextBuilder<ARGS>,
  ): WithArgsAccessors<ARGS, this> {
    this.sqlTextBuilder = sqlBuilder;

    return this as unknown as WithArgsAccessors<ARGS, this>;
  }

  public toSql(args: ARGS): string {
    return this.sqlTextBuilder ? this.sqlTextBuilder(args) : '';
  }
  /**
   * Serialize the values for the query config. The values are extracted from
   * the command arguments and converted into an array of values for the
   * query config.
   *
   * @returns An array of serialized values for the query config or an empty
   *    array if no value serializer is provided.
   */
  public serializeValues(args: ARGS): unknown[] {
    return this.valueSerializer ? this.valueSerializer(args) : [];
  }

  public parseResult(
    queryResult: QueryResult<QUERY_RESULT_ROW>,
    queryConfig: QueryConfig,
    args: ARGS,
  ): RESULT {
    const ctx = { args, queryResult, queryConfig };
    return this.resultParser
      ? this.resultParser(queryResult.rows, ctx)
      : (queryResult as unknown as RESULT);
  }

  public matchError(
    error: unknown,
    queryConfig: QueryConfig,
    args: ARGS,
  ): ERROR {
    if (!this.errorMatcher) {
      throw error;
    }
    return this.errorMatcher(error, { args, queryConfig });
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public toQueryConfig(text: string, parsedValues: unknown[]): QueryConfig {
    return { text, values: parsedValues };
  }

  public async execute(
    client: SqlQueryClient,
    optionalArgs?: Partial<ARGS>,
  ): Promise<Either<ERROR | InvalidArgsException<ARGS>, RESULT>> {
    const args = await this.args.build(optionalArgs);

    if (isLeft(args)) {
      return args;
    }

    const sqlText = this.toSql(args.right);
    const sqlValues = this.serializeValues(args.right);
    const queryConfig = this.toQueryConfig(sqlText, sqlValues);

    try {
      const queryResult = await client.query<QUERY_RESULT_ROW>(queryConfig);

      const parsedResult = this.parseResult(
        queryResult,
        queryConfig,
        args.right,
      );

      return right(parsedResult);
    } catch (error) {
      const matchedError = this.matchError(error, queryConfig, args.right);

      return left(matchedError);
    }
  }
}
