import type { NumericType } from '@kilbergr/where';
import type { SqlTagParserContext } from '../../parser-context';

export function Between(from: NumericType, to: NumericType) {
  return (context: SqlTagParserContext): void => {
    context
      .addKeyword('BETWEEN')
      .bindValue(from)
      .addKeyword('AND')
      .bindValue(to);
  };
}
