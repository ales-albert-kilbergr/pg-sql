import type {
  AnyValueType,
  BetweenOptions,
  Condition,
  NotBetweenOptions,
  PropertyCondition,
} from './where.types';
import type { SqlTagParserContext } from '../../parser-context';
import { Between } from '../between/between';
import { Identifier } from '../identifier/identifier';
import { Keyword } from '../keyword/keyword';
import { In } from '../in/in';
import { Compare } from '../compare/compare';
import type { Numeric } from 'type-fest/source/numeric';
import { Value } from '../value/value.node';

class SqlWhereTypeError extends TypeError {
  public constructor(message: string) {
    super(`Cannot construct WHERE clause: ${message}`);
  }
}

function assertOperatorProperty(
  operator: string,
  property?: string,
): asserts property is string {
  if (property === undefined) {
    throw new SqlWhereTypeError(
      `The operator "${operator}" requires a property.`,
    );
  }
}

function parseWhereCondition(
  context: SqlTagParserContext,
  condition: Condition,
  property?: string,
): void {
  const keys = Object.keys(condition as object);

  for (const [index, key] of keys.entries()) {
    const propertyCondition: PropertyCondition = condition as PropertyCondition;
    const value: unknown = propertyCondition[key];

    if (index > 0 && !['$or', '$not'].includes(key)) {
      context.addFragment(' AND ');
    }

    if (['$or', '$not', '$and'].includes(key)) {
      const operator = key === '$and' ? 'AND' : key === '$or' ? 'OR' : 'NOT';
      const subConditionKeysCount = Object.keys(value as object).length;
      if (subConditionKeysCount === 0) {
        continue;
      }
      context.addFragment(` ${operator} `);
      if (subConditionKeysCount > 1) {
        context.addFragment('(');
      }
      parseWhereCondition(context, value as Condition);
      if (subConditionKeysCount > 1) {
        context.closeBracket();
      }
    } else if (key === '$between') {
      assertOperatorProperty(key, property);

      const [from, to] = value as BetweenOptions['$between'];

      context.pipe(Identifier(property), Between(from, to));
    } else if (key === '$notBetween') {
      assertOperatorProperty(key, property);

      const [from, to] = value as NotBetweenOptions['$notBetween'];

      context.pipe(Identifier(property), Keyword('NOT'), Between(from, to));
    } else if (key === '$in') {
      assertOperatorProperty(key, property);

      context.pipe(Identifier(property), In(value as AnyValueType[]));
    } else if (key === '$nin') {
      assertOperatorProperty(key, property);

      context.pipe(
        Identifier(property),
        Keyword('NOT'),
        In(value as AnyValueType[]),
      );
    } else if (key === '$gt') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Gt(property, value as Numeric));
    } else if (key === '$gte') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Gte(property, value as Numeric));
    } else if (key === '$lt') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Lt(property, value as Numeric));
    } else if (key === '$lte') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Lte(property, value as Numeric));
    } else if (key === '$eq') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Eq(property, value as any));
    } else if (key === '$neq') {
      assertOperatorProperty(key, property);

      context.pipe(Compare.Neq(property, value as Numeric));
    } else if (key === '$like') {
      assertOperatorProperty(key, property);

      context.pipe(Identifier(property), Keyword('LIKE'), Value(value));
    } else if (key === '$notLike') {
      assertOperatorProperty(key, property);

      context.pipe(Identifier(property), Keyword('NOT'), Keyword('LIKE'), Value(value));
    } else if (key === '$iLike') {
      assertOperatorProperty(key, property);

      context.pipe(Identifier(property), Keyword('ILIKE'), Value(value));
    } else if (Array.isArray(value)) {
      context.pipe(Identifier(key), In(value));
    } else if (typeof value === 'object' && value !== null) {
      const subConditionKeysCount = Object.keys(value).length;
      if (subConditionKeysCount === 0) {
        continue;
      }
      parseWhereCondition(context, value as Condition, key);
    } else if (
      ['string', 'number', 'boolean', 'bigint'].includes(typeof value) ||
      value === null
    ) {
      context.pipe(Compare.Eq(key, value as any));
    }
  }
}

export function Where(condition?: Condition | null) {
  return (context: SqlTagParserContext): void => {
    if (condition === undefined || condition === null) return;

    const childContext = context.spawnChild();

    parseWhereCondition(childContext, condition);

    if (childContext.fragments.length > 0) {
      context.addFragment(' WHERE ');
      context.appendChild(childContext);
    }
  };
}

Where.TypeError = SqlWhereTypeError;
