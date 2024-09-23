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

export interface Column<T extends ColumnType, D, O extends object = object> {
  type: T;
  name: string;
  nullable: boolean;
  propertyKey: string;
  /**
   * SQL expression of default value
   */
  defaultExpression?: string;
  options?: O;
  serialize?: (value: D) => unknown;
  parse?: (value: unknown) => D;
}

export interface ColumnProps {
  nullable?: boolean;
  propertyKey?: string;
  defaultExpression?: string;
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
  { nullable, propertyKey, defaultExpression }: ColumnProps = {},
): Column<'smallint', number> {
  return {
    type: 'smallint',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
  };
}

export function defineIntegerColumn(
  name: string,
  { nullable, propertyKey, defaultExpression }: ColumnProps = {},
): Column<'integer', number> {
  return {
    type: 'integer',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
  };
}

export function defineBigintColumn(
  name: string,
  { nullable, propertyKey, defaultExpression }: ColumnProps = {},
): Column<'bigint', bigint> {
  return {
    type: 'bigint',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
    serialize: (value: bigint) => value.toString(),
    parse: (value: unknown) =>
      typeof value === 'string' ? BigInt(value) : BigInt(0),
  };
}

export function defineNumericColumn(
  name: string,
  {
    nullable,
    propertyKey,
    defaultExpression,
    ...otherProps
  }: ColumnProps & WithPrecisionColumnProps,
): Column<'numeric', number> {
  return {
    type: 'numeric',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
    options: otherProps,
  };
}

export function defineTextColumn(
  name: string,
  { nullable, propertyKey, defaultExpression }: ColumnProps = {},
): Column<'text', string> {
  return {
    type: 'text',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
  };
}

export function defineVarcharColumn(
  name: string,
  {
    nullable,
    propertyKey,
    defaultExpression,
    ...otherProps
  }: ColumnProps & WithLengthColumnProps,
): Column<'varchar', string, WithLengthColumnProps> {
  return {
    type: 'varchar',
    name,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
    defaultExpression,
    options: otherProps,
  };
}

// Time and date columns

export function defineTimestampWithTimeZoneColumn(
  name: string,
  { nullable, propertyKey, defaultExpression }: ColumnProps = {},
): Column<'timestampz', Date> {
  return {
    type: 'timestampz',
    name,
    defaultExpression,
    nullable: nullable ?? false,
    propertyKey: propertyKey ?? name,
  };
}

export function defineCreatedAtColumn({
  propertyKey,
}: Omit<ColumnProps, 'nullable'> = {}): Column<'timestampz', Date> {
  const name = 'created_at';

  return defineTimestampWithTimeZoneColumn(name, {
    propertyKey: propertyKey ?? name,
    defaultExpression: 'CURRENT_TIMESTAMP',
  });
}

export function defineUpdatedAtColumn({
  propertyKey,
}: Omit<ColumnProps, 'nullable'> = {}): Column<'timestampz', Date> {
  const name = 'updated_at';

  return defineTimestampWithTimeZoneColumn(name, {
    propertyKey: propertyKey ?? name,
    defaultExpression: 'CURRENT_TIMESTAMP',
  });
}
