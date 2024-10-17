import type { SqlTagParserContext } from '../parser-context';
import type { QueryConfig } from '../query-config';

export type SqlNodeVoidRenderer<A> = (
  args: A,
  ctx: SqlTagParserContext,
) => void;

export type SqlNodeQueryConfigRenderer<A> = (
  args: A,
  ctx: SqlTagParserContext,
) => QueryConfig | undefined;

export function createSqlNode<A>(
  render: SqlNodeVoidRenderer<A> | SqlNodeQueryConfigRenderer<A>,
) {
  return function sqlNode(args: A) {
    return (ctx: SqlTagParserContext): void => {
      const result = render(args, ctx);

      if (result) {
        ctx.mergeQueryConfig(result);
      }
    };
  };
}
