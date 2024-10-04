/* eslint-disable @typescript-eslint/method-signature-style */
import type { QueryResult, QueryResultRow, QueryConfig } from 'pg';
/**
 * A generic sql client interface to execute an sql command. This interface
 * fits well to Pool object to run single queries or to a PoolClient to run
 * queries in a transaction. The SqlCommand is never aware of the context
 * in which it runs.
 */
export interface SqlCommandClient {
  query<R extends QueryResultRow = QueryResultRow>(
    queryConfig: string | QueryConfig,
  ): Promise<QueryResult<R>>;
}
/**
 * An interface for a pure function which is responsible to build the sql
 * for a sql command. The function receives merged of prepared and instance
 * arguments and returns the sql text.
 *
 * Because the function and its nested helpers are supposed to be pure, the
 * memoization is a good practice to avoid unnecessary calculations.
 */
export type SqlTextBuilder<ARGS extends object> = (args: ARGS) => string;
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
 */
export type SqlValueSerializer<ARGS extends object> = (args: ARGS) => unknown[];

export interface SqlErrorMarcherContext<ARGS extends object> {
  args: ARGS;
  queryConfig: QueryConfig;
}

export type SqlErrorMatcher<ERROR, ARGS extends object = object> = (
  error: unknown,
  ctx: SqlErrorMarcherContext<ARGS>,
) => ERROR;

/**
 * The context available to each pipe operator in the chain
 */
export interface SqlResultParserContext<
  ARGS extends object,
  QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
> {
  args: ARGS;
  queryResult: QueryResult<QUERY_RESULT_ROW>;
  queryConfig: QueryConfig;
}

export type SqlResultParser<
  RESULT,
  ARGS extends object,
  QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
> = (
  result: QUERY_RESULT_ROW[],
  ctx: SqlResultParserContext<ARGS, QUERY_RESULT_ROW>,
) => RESULT;
