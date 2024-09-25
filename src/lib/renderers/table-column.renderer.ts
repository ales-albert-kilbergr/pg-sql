import type { Column } from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderKeyword } from './keyword.renderer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderTableColumn(column?: Column<any>): string {
  if (column === undefined) {
    return '';
  }

  let result = renderIdentifier(column.name) + renderKeyword(column.type.name);

  result += column.isNullable()
    ? renderKeyword('NULL')
    : renderKeyword('NOT NULL');

  if (column.default) {
    result += ` DEFAULT ${column.default.args.expression}`;
  }

  return result;
}
