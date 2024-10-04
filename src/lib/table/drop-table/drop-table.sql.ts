import {
  getCascadeSql,
  getIfExistsSql,
  getSchemaQualifiedName,
} from '../../sql';
import { formatSqlText } from '../../helpers';
import type { SchemaOwnedPartialObject } from '../../schema';
/**
 * The DROP TABLE command removes tables from the database. Only the table owner,
 * the schema owner, and superuser can drop a table. To empty a table of rows
 * without destroying the table, use DELETE or TRUNCATE.
 *
 * DROP TABLE always removes any indexes, rules, triggers, and constraints that
 * exist for the target table. However, to drop a table that is referenced
 * by a view or a foreign-key constraint of another table, CASCADE must be
 * specified. (CASCADE will remove a dependent view entirely, but in the
 * foreign-key case it will only remove the foreign-key constraint, not the
 * other table entirely.)
 *
 * @link https://www.postgresql.org/docs/current/sql-droptable.html
 */
export interface DropTableSqlArgs {
  /**
   * The table to drop
   */
  table: SchemaOwnedPartialObject;
  /**
   * Do not throw an error if the table does not exist.
   * A notice is issued in this case.
   */
  ifExists?: boolean;
  /**
   * CASCADE: Automatically drop objects that depend on the table
   * (such as views), and in turn all objects that depend on those objects.
   * @link https://www.postgresql.org/docs/current/ddl-depend.html
   *
   * RESTRICT: Refuse to drop the table if any objects depend on it.
   *   This is the default.
   */
  cascade?: boolean;
}
/**
 * Get the SQL text for a DROP TABLE command
 *
 * @param command - The DROP TABLE command
 * @returns The SQL text
 */
export function getDropTableSql(command: DropTableSqlArgs): string {
  const schemaQualifiedName = getSchemaQualifiedName(command.table);
  const ifExists = getIfExistsSql(command.ifExists);
  const cascade = getCascadeSql(command.cascade);

  return formatSqlText(
    `DROP TABLE ${ifExists} ${schemaQualifiedName} ${cascade};`,
  );
}
