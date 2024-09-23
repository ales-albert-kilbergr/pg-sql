import type { uuid } from '@kilbergr/tagged-types/uuid';
import type { QueryConfig as QueryConfigInterface } from 'pg';
import { randomUUID } from 'crypto';
import { SqlTagParserContext } from './parser-context';

export class QueryConfig implements QueryConfigInterface {
  public name?: string;

  public id: uuid = randomUUID() as uuid;

  public text: string;

  public values: unknown[];

  public constructor(text = '', values: unknown[] = []) {
    this.text = text;
    this.values = values;
  }

  public clone(): QueryConfig {
    const clone = new QueryConfig(this.text, [...this.values]);
    clone.name = this.name;

    return clone;
  }
}

export type QueryConfigBuilder<ARGS extends object | never = never> = (
  args: ARGS,
) => QueryConfig;

export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
): QueryConfigBuilder<ARGS_1 & ARGS_2>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
): QueryConfigBuilder<ARGS_1 & ARGS_2 & ARGS_3>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
): QueryConfigBuilder<ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
): QueryConfigBuilder<ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4 & ARGS_5>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
  ARGS_6 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
  f: QueryConfigBuilder<ARGS_6>,
): QueryConfigBuilder<ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4 & ARGS_5 & ARGS_6>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
  ARGS_6 extends object | never,
  ARGS_7 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
  f: QueryConfigBuilder<ARGS_6>,
  g: QueryConfigBuilder<ARGS_7>,
): QueryConfigBuilder<
  ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4 & ARGS_5 & ARGS_6 & ARGS_7
>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
  ARGS_6 extends object | never,
  ARGS_7 extends object | never,
  ARGS_8 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
  f: QueryConfigBuilder<ARGS_6>,
  g: QueryConfigBuilder<ARGS_7>,
  h: QueryConfigBuilder<ARGS_8>,
): QueryConfigBuilder<
  ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4 & ARGS_5 & ARGS_6 & ARGS_7 & ARGS_8
>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
  ARGS_6 extends object | never,
  ARGS_7 extends object | never,
  ARGS_8 extends object | never,
  ARGS_9 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
  f: QueryConfigBuilder<ARGS_6>,
  g: QueryConfigBuilder<ARGS_7>,
  h: QueryConfigBuilder<ARGS_8>,
  i: QueryConfigBuilder<ARGS_9>,
): QueryConfigBuilder<
  ARGS_1 & ARGS_2 & ARGS_3 & ARGS_4 & ARGS_5 & ARGS_6 & ARGS_7 & ARGS_8 & ARGS_9
>;
export function mergeQueryConfigBuilders<
  ARGS_1 extends object | never,
  ARGS_2 extends object | never,
  ARGS_3 extends object | never,
  ARGS_4 extends object | never,
  ARGS_5 extends object | never,
  ARGS_6 extends object | never,
  ARGS_7 extends object | never,
  ARGS_8 extends object | never,
  ARGS_9 extends object | never,
  ARGS_10 extends object | never,
>(
  a: QueryConfigBuilder<ARGS_1>,
  b: QueryConfigBuilder<ARGS_2>,
  c: QueryConfigBuilder<ARGS_3>,
  d: QueryConfigBuilder<ARGS_4>,
  e: QueryConfigBuilder<ARGS_5>,
  f: QueryConfigBuilder<ARGS_6>,
  g: QueryConfigBuilder<ARGS_7>,
  h: QueryConfigBuilder<ARGS_8>,
  i: QueryConfigBuilder<ARGS_9>,
  j: QueryConfigBuilder<ARGS_10>,
): QueryConfigBuilder<
  ARGS_1 &
    ARGS_2 &
    ARGS_3 &
    ARGS_4 &
    ARGS_5 &
    ARGS_6 &
    ARGS_7 &
    ARGS_8 &
    ARGS_9 &
    ARGS_10
>;
export function mergeQueryConfigBuilders(
  ...builders: QueryConfigBuilder<object>[]
) {
  return (args: object): QueryConfig => {
    const context = new SqlTagParserContext();
    for (const builder of builders) {
      const partialQuery = builder(args);
      context.mergeQueryConfig(partialQuery);
    }

    return context.toQueryConfig();
  };
}
