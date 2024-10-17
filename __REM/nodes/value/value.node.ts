import type { SqlTagParserContext } from '../../parser-context';

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Value {
  export interface Options {
    /**
     * If true, the value will be spread into the query. 
     * If false, the value will be treated as a single value.
     */
    spreadValues?: boolean;
  }
}

export function Value(
  value: unknown,
  options: Value.Options = Value.DEFAULT_OPTIONS,
) {
  return (context: SqlTagParserContext): void => {
    context.bindValue(value, options.spreadValues);
  };
}

Value.DEFAULT_OPTIONS = {
  spreadValues: false,
} as Value.Options;
