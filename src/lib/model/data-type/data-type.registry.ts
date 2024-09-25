/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from './data-type';
import { DataTypeDiscriminant } from './data-type.discriminant';
import {
  BIGINT_MAX_VALUE,
  BIGINT_MIN_VALUE,
  INTEGER_MAX_VALUE,
  INTEGER_MIN_VALUE,
  SMALLINT_MAX_VALUE,
  SMALLINT_MIN_VALUE,
} from './data-type.const';
import type {
  DataTypeArgs,
  DefaultDataNameTypeMap,
  WithLengthDataTypeArgs,
} from './data-type.types';

export class DataTypeRegistry {
  private readonly identityMap = new Map<string, DataType<any, any>>();

  public getBigInt(): DataType<DataTypeDiscriminant.BIGINT, bigint> {
    return this.getDataType(DataTypeDiscriminant.BIGINT, {
      parse: (value: unknown) => BigInt(value as string),
      serialize: (value: bigint) => value.toString(),
      minValue: BIGINT_MIN_VALUE,
      maxValue: BIGINT_MAX_VALUE,
    });
  }

  public getSmallInt(): DataType<DataTypeDiscriminant.SMALLINT, number> {
    return this.getDataType(DataTypeDiscriminant.SMALLINT, {
      minValue: SMALLINT_MIN_VALUE,
      maxValue: SMALLINT_MAX_VALUE,
    });
  }

  public getInt(): DataType<DataTypeDiscriminant.INTEGER, number> {
    return this.getDataType(DataTypeDiscriminant.INTEGER, {
      minValue: INTEGER_MIN_VALUE,
      maxValue: INTEGER_MAX_VALUE,
    });
  }

  public getVarchar(
    args: WithLengthDataTypeArgs,
  ): DataType<DataTypeDiscriminant.VARCHAR, string> {
    const memoKey = `${DataTypeDiscriminant.VARCHAR}:${args.length}`;

    return this.getDataType(DataTypeDiscriminant.VARCHAR, args, memoKey);
  }

  public getChar(
    args: WithLengthDataTypeArgs,
  ): DataType<DataTypeDiscriminant.CHAR, string> {
    const memoKey = `${DataTypeDiscriminant.CHAR}:${args.length}`;

    return this.getDataType(DataTypeDiscriminant.CHAR, args, memoKey);
  }

  public getText(): DataType<DataTypeDiscriminant.TEXT, string> {
    return this.getDataType(DataTypeDiscriminant.TEXT, {});
  }

  public getTimestamptz(): DataType<DataTypeDiscriminant.TIMESTAMPTZ, Date> {
    return this.getDataType(DataTypeDiscriminant.TIMESTAMPTZ, {
      parse: (value: unknown) => new Date(value as string),
      serialize: (value: Date) => value.toISOString(),
    });
  }

  private getDataType<
    N extends DataTypeDiscriminant,
    V = DefaultDataNameTypeMap<N>,
  >(name: N, args: DataTypeArgs<N, V>, memoKey: string = name): DataType<N, V> {
    if (!this.identityMap.has(memoKey)) {
      const type = new DataType<N, V>(name, args);

      this.identityMap.set(memoKey, type);
    }

    return this.identityMap.get(memoKey) as DataType<N, V>;
  }
}
