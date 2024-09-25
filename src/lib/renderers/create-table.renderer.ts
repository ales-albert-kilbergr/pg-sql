import type { CreateTableCommand } from '../commands';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';
import { renderIdentifier } from './identifier.renderer';
import { renderIfNotExists } from './keyword-flag.renderer';
import { renderPrimaryKey } from './primary-key.renderer';
import { renderTableCheck } from './table-check.renderer';
import { renderTableColumn } from './table-column.renderer';
import { renderTableForeignKey } from './table-foreign-key.renderer';
import { renderTableUniqueKey } from './table-unique-key.renderer';

export function renderCreateTable(command: CreateTableCommand): QueryConfig {
  const columnsArr = command.table.columns.toArray();

  const columns = columnsArr.map(renderTableColumn).join(',\n');

  const primaryKey = renderPrimaryKey(command.table.primaryKey);

  const uniqueKeys =
    command.table.uniqueKeys.count > 0
      ? command.table.uniqueKeys.toArray().map(renderTableUniqueKey).join(',\n')
      : '';

  const checks =
    command.table.checks.count > 0
      ? command.table.checks.toArray().map(renderTableCheck).join(',\n')
      : '';

  const foreignKeys =
    command.table.foreignKeys.count > 0
      ? command.table.foreignKeys
          .toArray()
          .map(renderTableForeignKey)
          .join(',\n')
      : '';

  const tableComponents = [
    columns,
    primaryKey,
    uniqueKeys,
    checks,
    foreignKeys,
  ].filter((x) => x.length > 0);

  return sql`
    CREATE TABLE
      ${renderIfNotExists(command.ifNotExists)}
      ${renderIdentifier(command.table.name)}
      (${tableComponents.join(',\n')});
  `;
}
