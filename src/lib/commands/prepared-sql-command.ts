import { SqlCommand } from './sql-command';
import type { QueryResultRow, QueryResult } from 'pg';
import type {
  SqlErrorMatcher,
  SqlResultParser,
  SqlTextBuilder,
  SqlValueSerializer,
} from './sql-command.types';
import {
  ArgsMap,
  createArgsAccessor,
  type WithArgsAccessors,
  type WithArgsMap,
} from '../args';
import type { Class } from 'type-fest';

//type ExtractArgs<C> = C extends SqlCommand<infer ARGS> ? ARGS : never;

export class PreparedSqlCommand<
  ARGS extends object,
  RESULT = QueryResult,
  ERROR = never,
  QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
> implements WithArgsMap<ARGS>
{
  /**
   * Prepared
   */
  public readonly args: ArgsMap<ARGS>;

  private sqlBuilder?: SqlTextBuilder<ARGS>;

  private valueSerializer?: SqlValueSerializer<ARGS>;

  private resultParser?: SqlResultParser<RESULT, ARGS, QUERY_RESULT_ROW>;

  private errorMatcher?: SqlErrorMatcher<ERROR, ARGS>;

  public constructor(args: ArgsMap<ARGS>) {
    this.args = args;
  }

  public static create<ARGS extends object>(
    ArgsCtor: Class<ARGS>,
  ): WithArgsAccessors<ARGS, PreparedSqlCommand<ARGS>> {
    const argsMap = new ArgsMap<ARGS>(ArgsCtor);

    const preparedCommand = new PreparedSqlCommand<ARGS>(argsMap);

    const preparedCommandWithArgsAccessors = createArgsAccessor<
      ARGS,
      PreparedSqlCommand<ARGS>
    >(preparedCommand);

    return preparedCommandWithArgsAccessors;
  }

  public useResultParser<
    NEW_RESULT,
    NEW_QUERY_RESULT_ROW extends QueryResultRow = QueryResultRow,
  >(
    parser: SqlResultParser<NEW_RESULT, ARGS, NEW_QUERY_RESULT_ROW>,
  ): WithArgsAccessors<
    ARGS,
    PreparedSqlCommand<ARGS, NEW_RESULT, ERROR, NEW_QUERY_RESULT_ROW>
  > {
    const self = this as unknown as WithArgsAccessors<
      ARGS,
      PreparedSqlCommand<ARGS, NEW_RESULT, ERROR, NEW_QUERY_RESULT_ROW>
    >;

    self.resultParser = parser;

    return self;
  }

  public useErrorMatcher<NEW_ERROR>(
    matcher: SqlErrorMatcher<NEW_ERROR, ARGS>,
  ): WithArgsAccessors<
    ARGS,
    PreparedSqlCommand<ARGS, RESULT, NEW_ERROR, QUERY_RESULT_ROW>
  > {
    const self = this as unknown as WithArgsAccessors<
      ARGS,
      PreparedSqlCommand<ARGS, RESULT, NEW_ERROR, QUERY_RESULT_ROW>
    >;

    self.errorMatcher = matcher;

    return self;
  }

  public useValueSerializer(
    parser: SqlValueSerializer<ARGS>,
  ): WithArgsAccessors<ARGS, this> {
    this.valueSerializer = parser;

    return this as unknown as WithArgsAccessors<ARGS, this>;
  }

  public useSqlTextBuilder(
    sqlBuilder: SqlTextBuilder<ARGS>,
  ): WithArgsAccessors<ARGS, this> {
    this.sqlBuilder = sqlBuilder;

    return this as unknown as WithArgsAccessors<ARGS, this>;
  }

  public clone(): PreparedSqlCommand<ARGS, RESULT, ERROR, QUERY_RESULT_ROW> {
    const clone = new PreparedSqlCommand<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>(
      this.args.clone(),
    );

    clone.sqlBuilder = this.sqlBuilder;
    clone.valueSerializer = this.valueSerializer;
    clone.resultParser = this.resultParser;
    clone.errorMatcher = this.errorMatcher;

    return clone;
  }

  public create(): SqlCommand<ARGS, RESULT, ERROR, QUERY_RESULT_ROW> {
    if (!this.sqlBuilder) {
      throw new TypeError('Cannot build command without a sqlBuilder');
    }

    const initArgs = this.args.clone();

    const sqlCommand = SqlCommand.create<ARGS, RESULT, ERROR, QUERY_RESULT_ROW>(
      initArgs,
      this.sqlBuilder,
    );

    if (this.valueSerializer) {
      sqlCommand.useValueSerializer(this.valueSerializer);
    }

    if (this.resultParser) {
      sqlCommand.useResultParser(this.resultParser);
    }

    if (this.errorMatcher) {
      sqlCommand.useErrorMatcher(this.errorMatcher);
    }

    return sqlCommand;
  }

  /*
  public async execute(
    client: SqlCommandClient,
    args?: ARGS,
  ): Promise<E.Either<ERROR, RESULT>> {
    const command = this.create(args);

    return command.execute(client);
  }
    */
}
