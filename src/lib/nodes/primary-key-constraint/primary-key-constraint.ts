import {
  FORMAT_IDENTIFIER_DEFAULT_OPTIONS,
  formatIdentifier,
} from '../../helpers/format-identifier/format-identifier';
import type { SqlTagParserContext } from '../../parser-context';

export function getPrimaryKeyConstraintName(tableName: string): string {
  return formatIdentifier(`pk_${tableName}`, FORMAT_IDENTIFIER_DEFAULT_OPTIONS);
}

export function PrimaryKeyConstraint(
  table: string,
  columns: string | string[],
) {
  const columnsStr = (Array.isArray(columns) ? columns : [columns])
    .map((c) => formatIdentifier(c, FORMAT_IDENTIFIER_DEFAULT_OPTIONS))
    .join(', ');
  const constraintName = getPrimaryKeyConstraintName(table);

  return (context: SqlTagParserContext): void => {
    context.addFragment(
      `CONSTRAINT ${constraintName} PRIMARY KEY (${columnsStr})`,
    );
  };
}
