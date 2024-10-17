import type { SqlTagParserContext } from '../../parser-context';
import type { QueryConfig } from '../../query-config';

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Exists {
  export interface Options {
    as?: string;
  }
}

export function Exists(
  queryConfig: QueryConfig,
  options: Exists.Options = Exists.DEFAULT_OPTIONS,
) {
  return (context: SqlTagParserContext): void => {
    context.addFragment('SELECT EXISTS (');
    context.mergeQueryConfig(queryConfig);
    context.addFragment(`) AS ${options.as}`);
  };
}

Exists.DEFAULT_OPTIONS = {
  as: '"exists"',
} as Exists.Options;
