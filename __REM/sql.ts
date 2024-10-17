import { SqlTagParserContext } from './parser-context';
import type { QueryConfig } from './query-config';
import type { SqlTemplateTag, SqlTemplateTagOptions } from './sql.types';

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && Reflect.has(value, 'raw');
}

export function sql(config: SqlTemplateTagOptions | string): SqlTemplateTag;
export function sql(
  strings: TemplateStringsArray,
  ...nodes: unknown[]
): QueryConfig;
export function sql(
  arg1: string | SqlTemplateTagOptions | TemplateStringsArray,
  ...nodes: unknown[]
): QueryConfig | SqlTemplateTag {
  if (isTemplateStringsArray(arg1)) {
    return SqlTagParserContext.from(Array.from(arg1), nodes).toQueryConfig();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return (strings: TemplateStringsArray, ...nodes: unknown[]) => {
      const query = SqlTagParserContext.from(
        Array.from(strings),
        nodes,
      ).toQueryConfig();

      if (typeof arg1 === 'string') {
        query.name = arg1;
      } else {
        query.name = arg1.name;
        query.id = arg1.queryId ?? query.id;
      }
      return query;
    };
  }
}
