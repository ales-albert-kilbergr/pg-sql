/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import type * as Postgres from '../model';
import { TableMetadata } from './table.metadata';

export interface ColumnBaseDecoratorArgs {
  columnName?: string;
  comment?: string;
}

/**
 * Define a simple non nullable column with the specified data type
 */
export function Column(
  dataType: 'bigint' | 'integer' | 'smallint' | 'text' | 'timestamptz',
  args?: ColumnBaseDecoratorArgs,
): PropertyDecorator;
export function Column(
  dataType: 'varchar' | 'char',
  args?: ColumnBaseDecoratorArgs & Postgres.WithLengthDataTypeArgs,
): PropertyDecorator;
export function Column(
  dataType: string,
  args?:
    | ColumnBaseDecoratorArgs
    | (ColumnBaseDecoratorArgs & Postgres.WithLengthDataTypeArgs),
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    if (typeof propertyKey === 'string') {
      TableMetadata.getMetadata(target.constructor).defineColumn(
        dataType as unknown as Postgres.DataTypeDiscriminant,
        {
          propertyKey,
          ...args,
        },
      );
    }
  };
}

export function CreatedAtColumn(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    if (typeof propertyKey === 'string') {
      TableMetadata.getMetadata(target.constructor).defineCreatedAtColumn(
        propertyKey,
      );
    }
  };
}

export function UpdatedAtColumn(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    if (typeof propertyKey === 'string') {
      TableMetadata.getMetadata(target.constructor).defineUpdatedAtColumn(
        propertyKey,
      );
    }
  };
}
