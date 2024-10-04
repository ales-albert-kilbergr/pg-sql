import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { DropSchemaArgs } from './drop-schema.args';
import type { Schema } from '../schema';
import { getDropSchemaSql } from './drop-schema.sql';

export * from './drop-schema.args';
export * from './drop-schema.sql';

export type PreparedDropSchemaCommand = PreparedSqlCommand<DropSchemaArgs>;

export type DropSchemaCommand = SqlCommand<DropSchemaArgs>;

export function prepareDropSchemaCommand(
  schema: Schema,
): PreparedDropSchemaCommand {
  return PreparedSqlCommand.create(DropSchemaArgs)
    .useSqlTextBuilder(getDropSchemaSql)
    .ifExists(true)
    .schema(schema);
}
