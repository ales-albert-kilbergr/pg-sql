import type { DataTypeDiscriminant } from './data-type.discriminant';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseDataTypeArgs<V = any> {
  parse?: (value: unknown) => V;
  serialize?: (value: V) => unknown;
}

// Args reusable extensions

export interface WithLengthDataTypeArgs {
  length: number;
}

export interface WithMinMaxValueDataTypeArgs<T extends number | bigint> {
  minValue: T;
  maxValue: T;
}

// prettier-ignore
export type DefaultDataNameTypeMap<N extends DataTypeDiscriminant> =
  N extends DataTypeDiscriminant.BIGINT 
  ? bigint
  : N extends DataTypeDiscriminant.INTEGER
  ? number
  : N extends DataTypeDiscriminant.SMALLINT
  ? number
  : N extends DataTypeDiscriminant.VARCHAR
  ? string
  : N extends DataTypeDiscriminant.CHAR
  ? string
  : N extends DataTypeDiscriminant.TEXT
  ? string
  : N extends DataTypeDiscriminant.TIMESTAMPTZ
  ? Date
  : unknown;

// prettier-ignore
export type DataTypeExtraArgsMap<N extends DataTypeDiscriminant> = N extends DataTypeDiscriminant.BIGINT
  ? WithMinMaxValueDataTypeArgs<bigint>
  : N extends DataTypeDiscriminant.INTEGER
  ? WithMinMaxValueDataTypeArgs<number>
  : N extends DataTypeDiscriminant.SMALLINT
  ? WithMinMaxValueDataTypeArgs<number>
  : N extends DataTypeDiscriminant.VARCHAR
  ? WithLengthDataTypeArgs
  : N extends DataTypeDiscriminant.CHAR
  ? WithLengthDataTypeArgs
  : object

export type DataTypeArgs<
  N extends DataTypeDiscriminant,
  V,
> = BaseDataTypeArgs<V> & DataTypeExtraArgsMap<N>;

export type NonNullableParseReturnType<
  A,
  N extends DataTypeDiscriminant,
> = A extends {
  parse: (value: unknown) => infer W;
}
  ? NonNullable<W>
  : DefaultDataNameTypeMap<N>;
