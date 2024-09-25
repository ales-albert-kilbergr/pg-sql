import type { NumericType } from '../where/where.types';
import type { SqlTagParserContext } from '../../parser-context';

export function Between(from: NumericType | Date, to: NumericType | Date) {
  return (context: SqlTagParserContext): void => {
    const fromValue = from instanceof Date ? from.toISOString() : from;
    const toValue = to instanceof Date ? to.toISOString() : to;
    context
      .addKeyword('BETWEEN')
      .bindValue(fromValue)
      .addKeyword('AND')
      .bindValue(toValue);
  };
}
