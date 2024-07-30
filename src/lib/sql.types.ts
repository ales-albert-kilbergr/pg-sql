import type { uuid } from '@kilbergr/tagged-types/uuid';
import type { QueryConfig } from './query-config';
import type { SqlTagParserContext } from './parser-context';

export type SqlTemplateTag = (
  strings: TemplateStringsArray,
  ...rawValues: unknown[]
) => QueryConfig;

export interface SqlTemplateTagOptions {
  name?: string;
  queryId?: uuid;
}

export interface SqlTemplateNode {
  parse: (context: SqlTagParserContext) => void;
}
