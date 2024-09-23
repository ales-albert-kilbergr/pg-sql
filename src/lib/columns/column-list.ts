import type { Column } from './column';
import type { ColumnType } from './column-type';

export class ColumnList {
  /**
   * A map where an entity's property key is the key and the column metadata is the value.
   */
  private readonly columnsPropertyMap: Map<string, Column<ColumnType, unknown>>;

  /**
   * A map where an entity's column name is the key and the column metadata is the value.
   */
  private readonly columnsNameMap: Map<string, Column<ColumnType, unknown>>;

  public constructor(columns: Column<ColumnType, unknown>[]) {
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
    source: Set<Column<ColumnType, unknown>> | Column<ColumnType, unknown>[],
  ): ColumnList {
    return new ColumnList(Array.from(source));
  }

  public add<T extends ColumnType, D, O extends object = object>(
    column: Column<T, D, O>,
  ): void {
    this.columnsPropertyMap.set(
      column.propertyKey,
      column as Column<ColumnType, unknown>,
    );
    this.columnsNameMap.set(column.name, column as Column<ColumnType, unknown>);
  }

  public get<T extends ColumnType, D, O extends object = object>(
    propertyKey: string,
  ): Column<T, D, O> | undefined {
    return this.columnsPropertyMap.get(propertyKey) as Column<T, D, O>;
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
