import {
  FORMAT_IDENTIFIER_DEFAULT_OPTIONS,
  formatIdentifier,
} from '../../helpers/format-identifier/format-identifier';
import type { SqlTagParserContext } from '../../parser-context';

export function getUniqueConstraintName(
  table: string,
  columns: string[],
): string {
  return formatIdentifier(
    `un_${table}_${columns.join('_')}`,
    FORMAT_IDENTIFIER_DEFAULT_OPTIONS,
  );
}

export function UniqueConstraint(table: string, columns: string | string[]) {
  const columnsArr = Array.isArray(columns) ? columns : [columns];
  const columnsStr = columnsArr
    .map((c) => formatIdentifier(c, FORMAT_IDENTIFIER_DEFAULT_OPTIONS))
    .join(', ');
  const constraintName = getUniqueConstraintName(table, columnsArr);

  return (context: SqlTagParserContext): void => {
    context.addFragment(`CONSTRAINT ${constraintName} UNIQUE (${columnsStr})`);
  };
}
