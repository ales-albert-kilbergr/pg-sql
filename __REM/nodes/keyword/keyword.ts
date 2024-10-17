import type { SqlTagParserContext } from '../../parser-context';
import type { SqlKeyword } from '../../sql-keyword';

export function Keyword(keyword: SqlKeyword) {
  return (context: SqlTagParserContext): void => {
    context.addKeyword(keyword);
  };
}
