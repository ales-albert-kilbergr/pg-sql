import {
  declareTaggedType,
  TaggedTypeError,
} from '@kilbergr/tagged-types/tagged-type';
import type { Tagged } from 'type-fest';

export type identifier = Tagged<string, 'identifier'>;

const IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export const Identifier = declareTaggedType({
  isTypeof: (value: unknown): value is identifier => {
    return typeof value === 'string' && IDENTIFIER_REGEX.test(value);
  },
  TypeError: class IdentifierTypeError extends TaggedTypeError('identifier') {},
});
