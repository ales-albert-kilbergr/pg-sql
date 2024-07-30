import type { Numeric } from 'type-fest/source/numeric';
import type { SqlTagParserContext } from '../../parser-context';

export function Compare(
  property: string,
  value: Numeric | string | boolean,
  operator: '>' | '<' | '>=' | '<=' | '=' | '<>',
) {
  return (context: SqlTagParserContext): void => {
    context.addIdentifier(property).addKeyword(operator).bindValue(value);
  };
}

Compare.Gt = (property: string, value: Numeric): ReturnType<typeof Compare> =>
  Compare(property, value, '>');

Compare.Gte = (property: string, value: Numeric): ReturnType<typeof Compare> =>
  Compare(property, value, '>=');

Compare.Lt = (property: string, value: Numeric): ReturnType<typeof Compare> =>
  Compare(property, value, '<');

Compare.Lte = (property: string, value: Numeric): ReturnType<typeof Compare> =>
  Compare(property, value, '<=');

Compare.Eq = (
  property: string,
  value: Numeric | string | boolean | null,
): ReturnType<typeof Compare> =>
  value === null
    ? (context): void => {
        context.addIdentifier(property).addKeyword('IS').addKeyword('NULL');
      }
    : Compare(property, value, '=');

Compare.Neq = (
  property: string,
  value: Numeric | string | boolean | null,
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
