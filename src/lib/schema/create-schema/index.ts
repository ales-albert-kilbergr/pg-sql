import { PreparedSqlCommand, type SqlCommand } from '../../commands';
import { CreateSchemaArgs } from './create-schema.args';
import type { Schema } from '../schema';
import { getCreateSchemaSql } from './create-schema.sql';

export * from './create-schema.args';
export * from './create-schema.sql';

export type PreparedCreateSchemaCommand = PreparedSqlCommand<CreateSchemaArgs>;

export type CreateSchemaCommand = SqlCommand<CreateSchemaArgs>;

export function prepareCreateSchemaCommand(
  schema: Schema,
): PreparedCreateSchemaCommand {
  return PreparedSqlCommand.create(CreateSchemaArgs)
    .ifNotExists(true)
    .schema(schema)
    .useSqlTextBuilder(getCreateSchemaSql);
}
