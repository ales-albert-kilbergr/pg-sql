import type { Numeric } from 'type-fest/source/numeric';
import type { SqlTagParserContext } from '../../parser-context';

export function Compare(
  property: string,
  value: Numeric | string | boolean | Date,
  operator: '>' | '<' | '>=' | '<=' | '=' | '<>',
) {
  return (context: SqlTagParserContext): void => {
    const valueStr = value instanceof Date ? value.toISOString() : value;

    context.addIdentifier(property).addKeyword(operator).bindValue(valueStr);
  };
}

Compare.Gt = (
  property: string,
  value: Numeric | Date,
): ReturnType<typeof Compare> => Compare(property, value, '>');

Compare.Gte = (
  property: string,
  value: Numeric | Date,
): ReturnType<typeof Compare> => Compare(property, value, '>=');

Compare.Lt = (
  property: string,
  value: Numeric | Date,
): ReturnType<typeof Compare> => Compare(property, value, '<');

Compare.Lte = (
  property: string,
  value: Numeric | Date,
): ReturnType<typeof Compare> => Compare(property, value, '<=');

Compare.Eq = (
  property: string,
  value: Numeric | string | boolean | null | Date,
): ReturnType<typeof Compare> =>
  value === null
    ? (context): void => {
        context.addIdentifier(property).addKeyword('IS').addKeyword('NULL');
      }
    : Compare(property, value, '=');

Compare.Neq = (
  property: string,
  value: Numeric | string | boolean | null | Date,
): ReturnType<typeof Compare> =>
  value === null
    ? (context): void => {
        context
          .addIdentifier(property)
          .addKeyword('IS')
          .addKeyword('NOT')
          .addKeyword('NULL');
      }
    : Compare(property, value, '<>');
