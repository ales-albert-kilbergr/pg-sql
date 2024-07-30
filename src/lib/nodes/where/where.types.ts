/* eslint-disable @typescript-eslint/consistent-type-definitions */
// eslint-disable-next-line @typescript-eslint/no-namespace
export type NumericType = number | bigint;

export type AnyValueType = NumericType | string | boolean | null;

export type EqOptions<V extends AnyValueType = AnyValueType> = {
  $eq: V;
};

export type InOptions<V extends AnyValueType = AnyValueType> = {
  $in: V[];
};

export type NotInOptions<V extends AnyValueType = AnyValueType> = {
  $nin: V[];
};

export type NotEqualOptions<V extends AnyValueType = AnyValueType> = {
  $neq: V;
};

export type BetweenOptions<V extends NumericType = NumericType> = {
  $between: [V, V];
};

export type NotBetweenOptions<V extends NumericType = NumericType> = {
  $notBetween: [V, V];
};

export type GteOptions<V extends NumericType = NumericType> = {
  $gte: V;
};

export type LteOptions<V extends NumericType = NumericType> = {
  $lte: V;
};

export type GtOptions<V extends NumericType = NumericType> = {
  $gt: V;
};

export type LtOptions<V extends NumericType = NumericType> = {
  $lt: V;
};

export type LikeOptions<V extends string = string> = {
  $like: V;
};

export type ILikeOptions<V extends string = string> = {
  $iLike: V;
};

export type NotILikeOptions<V extends string = string> = {
  $notILike: V;
};

export type NotLikeOptions<V extends string = string> = {
  $notLike: V;
};

export type IsNullOptions = {
  $isNull: boolean;
};

/**
 * A where for a value understood like a text. (Which means no comparing of
 * greater or lower values)
 */
export type BaseOptions<V extends AnyValueType = AnyValueType> =
  | EqOptions<V>
  | InOptions<V>
  | NotInOptions<V>
  | NotEqualOptions<V>
  | IsNullOptions;

export type TextOptions =
  | LikeOptions
  | NotLikeOptions
  | ILikeOptions
  | NotILikeOptions
  | IsNullOptions;

export type NumericOptions<NUM extends bigint | number = number> =
  | BetweenOptions<NUM>
  | NotBetweenOptions<NUM>
  | GteOptions<NUM>
  | LteOptions<NUM>
  | GtOptions<NUM>
  | LtOptions<NUM>;

export type Options<V extends AnyValueType = AnyValueType> = V extends string
  ? BaseOptions<V> | TextOptions
  : V extends boolean
    ? BaseOptions<V>
    : V extends null
      ? BaseOptions<V>
      : V extends bigint
        ? BaseOptions<V> | NumericOptions<V>
        : V extends number
          ? BaseOptions<V> | NumericOptions<V>
          : never;

export type PropertyCondition<V extends AnyValueType = AnyValueType> = Record<
  string,
  V | V[] | Options<V> | null | undefined
>;

export type OrCondition = {
  $or: PropertyCondition | NotCondition | OrCondition;
};

export type NotCondition = {
  $not: PropertyCondition;
};

export type Condition = PropertyCondition | OrCondition | NotCondition;
