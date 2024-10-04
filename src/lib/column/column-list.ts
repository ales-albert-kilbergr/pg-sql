import type { Column } from './column';
import { DatabaseObjectList } from '../database-object';
/**
 * An indexed list of columns.
 */
export class ColumnList extends DatabaseObjectList<Column> {
  private readonly propertyKeyIdx: Map<string, Column> = new Map<
    string,
    Column
  >();

  public constructor(columns: Column[] = []) {
    super(columns);

    for (const column of columns) {
      this.propertyKeyIdx.set(column.propertyKey, column);
    }
  }

  public add(columns: Column | Column[]): void {
    const columnArr = Array.isArray(columns) ? columns : [columns];
    super.add(columnArr);
    for (const column of columnArr) {
      this.propertyKeyIdx.set(column.propertyKey, column);
    }
  }

  public delete(columns: Column | Column[] | string | string[]): string[] {
    const argArgs = Array.isArray(columns) ? columns : [columns];

    const columnsToBeDeleted = argArgs
      .map((arg) => (typeof arg === 'string' ? this.get(arg) : arg))
      .filter(Boolean) as Column[];

    const deletedNames = super.delete(columns);

    for (const column of columnsToBeDeleted) {
      this.propertyKeyIdx.delete(column.propertyKey);
    }

    return deletedNames;
  }

  public deleteAll(): void {
    super.deleteAll();
    this.propertyKeyIdx.clear();
  }

  public getByPropertyKey(propertyKey: string): Column | undefined {
    return this.propertyKeyIdx.get(propertyKey);
  }

  public hasPropertyKey(propertyKey: string): boolean {
    return this.propertyKeyIdx.has(propertyKey);
  }
}
