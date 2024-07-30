import type { AnyValueType } from '@kilbergr/where';
import type { SqlTagParserContext } from '../../parser-context';

export function In<V extends AnyValueType = AnyValueType>(values: V[]) {
  return (context: SqlTagParserContext): void => {
    context
      .addKeyword('IN')
      .openBracket()
      .bindValue(values, true)
      .closeBracket();
  };
}
