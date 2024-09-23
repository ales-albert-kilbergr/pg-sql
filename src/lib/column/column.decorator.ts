import { SetMetadata } from '@kilbergr/metadata';
import {
  type ColumnProps,
  defineBigintColumn,
  defineIntegerColumn,
  defineNumericColumn,
  defineSmallintColumn,
  defineTextColumn,
  type WithLengthColumnProps,
  type IColumn,
  type WithPrecisionColumnProps,
} from './column';
import type { ColumnType } from './column-type';

const metadata = new SetMetadata<IColumn<ColumnType, any>>('pg:column');

export function Column(
  type: 'varchar',
  options: ColumnProps & WithLengthColumnProps,
): PropertyDecorator;
export function Column(
  type: 'numeric',
  options: ColumnProps & WithPrecisionColumnProps,
): PropertyDecorator;
export function Column(
  type: Exclude<ColumnType, 'varchar' | 'numeric'>,
  options?: ColumnProps,
): PropertyDecorator;
export function Column(
  type: ColumnType,
  { name, nullable, ...otherOptions }: any = {},
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    if (typeof propertyKey === 'symbol') {
      throw new TypeError('Symbol properties are not supported');
    }

    const columnName: string = name ?? propertyKey;

    switch (type) {
      case 'smallint':
        metadata.add(
          target.constructor,
          defineSmallintColumn(columnName, {
            propertyKey,
            nullable,
          }),
        );
        break;
      case 'integer':
        metadata.add(
          target.constructor,
          defineIntegerColumn(columnName, {
            propertyKey,
            nullable,
          }),
        );
        break;
      case 'bigint':
        metadata.add(
          target.constructor,
          defineBigintColumn(columnName, {
            propertyKey,
            nullable,
          }),
        );
      case 'numeric':
        metadata.add(
          target.constructor,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          defineNumericColumn(columnName, {
            propertyKey,
            nullable,
            ...otherOptions,
          }),
        );
      case 'text':
        metadata.add(
          target.constructor,
          defineTextColumn(columnName, {
            propertyKey,
            nullable,
          }),
        );
      default:
        throw new TypeError(
          `Cannot define new column. The type "${type}" is ` +
            `either not implemented or unsupported`,
        );
    }
  };
}

Column.metadata = metadata;
