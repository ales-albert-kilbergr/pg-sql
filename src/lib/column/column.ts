import type { ColumnType } from './column-type';

export interface VarcharColumnProps {
  columnType: 'character varying' | 'varchar';
  length: number;
}

export interface NumericColumnProps {
  columnType: 'numeric';
  precision: number;
  scale: number;
}

export interface IColumn<
  TYPE extends ColumnType,
  DATA_TYPE,
  O extends object = object,
> {
  type: TYPE;
  name: string;
  nullable: boolean;
  propertyKey: string;
  options?: O;
  serialize?: (value: DATA_TYPE) => unknown;
  parse?: (value: unknown) => DATA_TYPE;
}

export interface ColumnProps {
  nullable?: boolean;
  propertyKey?: string;
}

export interface WithLengthColumnProps {
  length: number;
}

export interface WithPrecisionColumnProps {
  precision: number;
  scale: number;
}

export function defineSmallintColumn(
  name: string,
  props: ColumnProps = {},
): IColumn<'smallint', number> {
  return {
    type: 'smallint',
    name,
    nullable: props.nullable ?? false,
    propertyKey: props.propertyKey ?? name,
  };
}

export function defineIntegerColumn(
  name: string,
  props: ColumnProps = {},
): IColumn<'integer', number> {
  return {
    type: 'integer',
    name,
    nullable: props.nullable ?? false,
    propertyKey: props.propertyKey ?? name,
  };
}

export function defineBigintColumn(
  name: string,
  props: ColumnProps = {},
): IColumn<'bigint', bigint> {
  return {
    type: 'bigint',
    name,
    nullable: props.nullable ?? false,
    propertyKey: props.propertyKey ?? name,
    serialize: (value: bigint) => value.toString(),
    parse: (value: unknown) =>
      typeof value === 'string' ? BigInt(value) : BigInt(0),
  };
}

export function defineNumericColumn(
  name: string,
  props: ColumnProps & WithPrecisionColumnProps,
): IColumn<'numeric', number> {
  return {
    type: 'numeric',
    name,
    nullable: props.nullable ?? false,
    propertyKey: props.propertyKey ?? name,
  };
}

export function defineTextColumn(
  name: string,
  { nullable, propertyKey }: ColumnProps = {},
): IColumn<'text', string> {
  return {
    type: 'text',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
  };
}

export function defineVarcharColumn(
  name: string,
  { nullable, propertyKey, ...otherProps }: ColumnProps & WithLengthColumnProps,
): IColumn<'varchar', string, WithLengthColumnProps> {
  return {
    type: 'varchar',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    options: otherProps,
  };
}

// Time and date columns

export function defineTimestampWithTimeZoneColumn(
  name: string,
  { nullable, propertyKey }: ColumnProps = {},
): IColumn<'timestampz', Date> {
  return {
    type: 'timestampz',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
  };
}
