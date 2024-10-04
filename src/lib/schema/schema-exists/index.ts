import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import type { Schema } from '../schema';
import { SchemaExistsArgs } from './schema-exists.args';
import { schemaExistsPipe } from './schema-exists.pipe';
import { getSchemaExistsSql } from './schema-exists.sql';

export * from './schema-exists.args';

export type PreparedSchemaExistsCommand = PreparedSqlCommand<
  SchemaExistsArgs,
  boolean
>;

export type SchemaExistsCommand = SqlCommand<SchemaExistsArgs, boolean>;

export function prepareSchemaExistsCommand(
  schema: Schema,
): PreparedSchemaExistsCommand {
  return PreparedSqlCommand.create(SchemaExistsArgs)
    .schema(schema)
    .useSqlTextBuilder(getSchemaExistsSql)
    .useResultParser(schemaExistsPipe)
    .useValueSerializer((args) => [args.schema.name]);
}
