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

  public add(...columns: Column[]): void {
    super.add(...columns);
    for (const column of columns) {
      this.propertyKeyIdx.set(column.propertyKey, column);
    }
  }

  public delete(...columns: Column[]): void {
    super.delete(...columns);
    for (const column of columns) {
      this.propertyKeyIdx.delete(column.propertyKey);
    }
  }

  public deleteAll(): void {
    super.deleteAll();
    this.propertyKeyIdx.clear();
  }

  public getByPropertyKey(propertyKey: string): Column | undefined {
    return this.propertyKeyIdx.get(propertyKey);
  }
}
