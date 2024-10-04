import { escapeIdentifier } from 'pg';
import { getCascadeSql, getIfExistsSql } from '../../sql';
import { formatSqlText } from '../../helpers';
/**
 * A schema can only be dropped by its owner or a superuser. Note that the owner
 * can drop the schema (and thereby all contained objects) even if they do not
 * own some of the objects within the schema.
 */
export interface DropSchemaSqlArgs {
  /**
   * The schema to drop
   */
  schema: { name: string };
  /**
   * Do not throw an error if the schema does not exist.
   * A notice is issued in this case.
   */
  ifExists: boolean;
  /**
   * Automatically drop objects (tables, functions, etc.) that are contained
   * in the schema, and in turn all objects that depend on those objects
   *
   * @link https://www.postgresql.org/docs/current/ddl-depend.html
   */
  cascade: boolean;
}

export function getDropSchemaSql(command: DropSchemaSqlArgs): string {
  const schemaName = escapeIdentifier(command.schema.name);
  const ifExists = getIfExistsSql(command.ifExists);
  const cascade = getCascadeSql(command.cascade);

  return formatSqlText(`DROP SCHEMA ${ifExists} ${schemaName} ${cascade};`);
}
