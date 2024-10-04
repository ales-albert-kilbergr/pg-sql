import type { DatabaseObjectName } from './database-object.types';
import type { DatabaseObject } from './database-object';

export class DatabaseObjectList<O extends DatabaseObject> {
  private objects: O[] = [];

  private readonly nameIdx: Map<DatabaseObjectName, O> = new Map<
    DatabaseObjectName,
    O
  >();

  public constructor(objects: O[] = []) {
    this.objects = objects;

    for (const object of objects) {
      this.nameIdx.set(object.name, object);
    }
  }

  public get count(): number {
    return this.objects.length;
  }

  public add(objects: O | O[]): void {
    const objectArgs = Array.isArray(objects) ? objects : [objects];
    for (const object of objectArgs) {
      this.objects.push(object);
      this.nameIdx.set(object.name, object);
    }
  }

  public delete(objects: O | O[] | string | string[]): string[] {
    const argArgs = Array.isArray(objects) ? objects : [objects];
    const objectNames = argArgs.map((arg) =>
      typeof arg === 'string' ? arg : arg.name,
    );
    const deletedNames: string[] = [];

    this.objects = this.objects.filter((o) => {
      const isDeleted = !objectNames.includes(o.name);

      if (isDeleted) {
        deletedNames.push(o.name);
        this.nameIdx.delete(o.name);
      }

      return isDeleted;
    });

    return deletedNames;
  }

  public deleteAll(): void {
    this.objects = [];
    this.nameIdx.clear();
  }

  public get(name: string): O | undefined {
    return this.nameIdx.get(name);
  }

  public has(name: string): boolean {
    return this.nameIdx.has(name);
  }

  public [Symbol.iterator](): Iterator<O> {
    let index = 0;
    const { objects } = this;

    return {
      next(): IteratorResult<O> {
        if (index < objects.length) {
          return { value: objects[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}
