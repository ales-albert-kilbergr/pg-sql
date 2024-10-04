import { formatSqlText } from '../../helpers';

export function getSchemaExistsSql(): string {
  return formatSqlText(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.schemata
      WHERE schema_name = $1
    ) AS "exists";
  `);
}
