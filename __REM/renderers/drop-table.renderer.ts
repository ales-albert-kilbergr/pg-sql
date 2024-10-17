import type { DropTableCommand } from '../commands';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';
import { renderIdentifier } from './identifier.renderer';
import { renderCascade, renderIfExists } from './keyword-flag.renderer';

/**
 * @see https://www.postgresql.org/docs/current/sql-droptable.html
 */
export function renderDropTable(command: DropTableCommand): QueryConfig {
  const tableName = renderIdentifier(command.table.name);
  const cascade = renderCascade(command.cascade);
  const ifExists = renderIfExists(command.ifExists);

  return sql`DROP TABLE ${ifExists} ${tableName} ${cascade};`;
}
