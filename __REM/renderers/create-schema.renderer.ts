import type { CreateSchemaCommand } from '../commands';
import type { QueryConfig } from '../query-config';
import { sql } from '../sql';
import { renderAuthorization } from './authorization.renderer';
import { renderIdentifier } from './identifier.renderer';
import { renderIfNotExists } from './keyword-flag.renderer';

export function renderCreateSchemaCommand(
  command: CreateSchemaCommand,
): QueryConfig {
  return sql`
    CREATE SCHEMA
      ${renderIfNotExists(command.ifNotExists)}
      ${renderIdentifier(command.schema.name)}
      ${renderAuthorization(command.authorization)};
  `;
}
