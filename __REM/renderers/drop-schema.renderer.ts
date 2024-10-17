import type { DropSchemaCommand } from '../commands';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';
import { renderIdentifier } from './identifier.renderer';
import { renderCascade, renderIfExists } from './keyword-flag.renderer';

/**
 * @see https://www.postgresql.org/docs/current/sql-dropschema.html
 */
export function renderDropSchema(command: DropSchemaCommand): QueryConfig {
  const schemaName = renderIdentifier(command.schema.name);
  const cascade = renderCascade(command.cascade);
  const ifExists = renderIfExists(command.ifExists);

  return sql`DROP SCHEMA ${ifExists} ${schemaName} ${cascade};`;
}
