import type { IColumn } from './column';
import type { ColumnType } from './column-type';

export class ColumnList {
  /**
   * A map where an entity's property key is the key and the column metadata is the value.
   */
  private readonly columnsPropertyMap: Map<
    string,
    IColumn<ColumnType, unknown>
  >;

  /**
   * A map where an entity's column name is the key and the column metadata is the value.
   */
  private readonly columnsNameMap: Map<string, IColumn<ColumnType, unknown>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(columns: IColumn<ColumnType, any>[]) {
    this.columnsPropertyMap = columns.reduce((acc, column) => {
      acc.set(column.propertyKey, column);
      return acc;
    }, new Map());

    this.columnsNameMap = columns.reduce((acc, column) => {
      acc.set(column.name, column);
      return acc;
    }, new Map());
  }

  public static from(
    source: Set<IColumn<ColumnType, unknown>> | IColumn<ColumnType, unknown>[],
  ): ColumnList {
    return new ColumnList(Array.from(source));
  }

  public add<T extends ColumnType, D, O extends object = object>(
    column: IColumn<T, D, O>,
  ): void {
    this.columnsPropertyMap.set(
      column.propertyKey,
      column as IColumn<ColumnType, unknown>,
    );
    this.columnsNameMap.set(
      column.name,
      column as IColumn<ColumnType, unknown>,
    );
  }

  public get<T extends ColumnType, D, O extends object = object>(
    propertyKey: string,
  ): IColumn<T, D, O> | undefined {
    return this.columnsPropertyMap.get(propertyKey) as IColumn<T, D, O>;
  }

  public remove(propertyKey: string): boolean {
    const column = this.columnsPropertyMap.get(propertyKey);

    if (column) {
      this.columnsPropertyMap.delete(propertyKey);
      this.columnsNameMap.delete(column.name);

      return true;
    }
    return false;
  }

  public has(propertyKey: string): boolean {
    return this.columnsPropertyMap.has(propertyKey);
  }

  public propertyKeysToColumnNames(propertyKeys: string[]): string[] {
    return propertyKeys.map((propertyKey) => {
      const column = this.columnsPropertyMap.get(propertyKey);

      if (!column) {
        throw new TypeError(
          `Column metadata is not defined for ${propertyKey}`,
        );
      }

      return column.name;
    });
  }

  public getColumnName(propertyKey: string): string {
    const column = this.columnsPropertyMap.get(propertyKey);

    if (!column) {
      throw new TypeError(`Column metadata is not defined for ${propertyKey}`);
    }

    return column.name;
  }

  public getPropertyKeys(): string[] {
    return Array.from(this.columnsPropertyMap.keys());
  }
}
