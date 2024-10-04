import type { Column } from '../../column';
import type { DataType, DataTypeDiscriminant } from '../../data-type';
import { DatabaseObject } from '../database-object';
import type { Schema } from '../schema';

export type AnySequenceType =
  | DataTypeDiscriminant.BIGINT
  | DataTypeDiscriminant.INTEGER
  | DataTypeDiscriminant.SMALLINT;

export class Sequence<
  T extends AnySequenceType = DataTypeDiscriminant.INTEGER,
> extends DatabaseObject<Schema> {
  /**
   * Valid types are smallint, integer, and bigint. bigint is the default.
   * The data type determines the default minimum and maximum values
   * of the sequence.
   */
  public type: DataType<T>;

  public incrementBy = 1;

  public minValue?: number;

  public maxValue?: number;

  public startValue?: number;

  public cache?: number;

  public cycle = false;

  public ownedBy?: Column<DataType<T>>;

  public declare parent: Schema;

  public constructor(name: string, parent: Schema, type: DataType<T>) {
    super(name, parent);

    this.type = type;
  }

  public get schema(): Schema {
    return this.parent;
  }
}
