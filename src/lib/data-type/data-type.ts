/* eslint-disable @typescript-eslint/class-methods-use-this */
import type { DataTypeDiscriminant } from './data-type.discriminant';
import type { DataTypeArgs, DefaultDataNameTypeMap } from './data-type.types';

export class DataType<
  N extends DataTypeDiscriminant = DataTypeDiscriminant,
  V = DefaultDataNameTypeMap<N>,
> {
  public readonly name: N;

  public readonly args: DataTypeArgs<N, V>;

  public constructor(
    name: N,
    args: DataTypeArgs<N, V> = {} as DataTypeArgs<N, V>,
  ) {
    this.name = name;
    this.args = args;
  }

  public static isOfType<N extends DataTypeDiscriminant = DataTypeDiscriminant>(
    value: unknown,
    name: N,
  ): value is DataType<N> {
    return value instanceof DataType && value.name === name;
  }
  /**
   *
   * Args are considered read-only because the data type registry is computing
   * a memoization parameters to avoid creating the same data type multiple times.
   *
   * @param key
   * @returns
   */
  public getArg(key: keyof DataTypeArgs<N, V>): DataTypeArgs<N, V>[typeof key] {
    return this.args[key];
  }

  public parse(value: unknown): V | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    return this.args.parse ? this.args.parse(value) : (value as V);
  }

  public serialize(value: V | null | undefined): unknown {
    if (value === null || value === undefined) {
      return value;
    }
    return this.args.serialize ? this.args.serialize(value) : value;
  }
}
