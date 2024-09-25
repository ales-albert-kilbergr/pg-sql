import type { identifier } from '../identifier';
import type { DatabaseObject } from './database-object';

export class DatabaseObjectList<O extends DatabaseObject> {
  private objects: O[] = [];

  private readonly nameIdx: Map<identifier, O> = new Map<identifier, O>();

  public constructor(objects: O[] = []) {
    this.objects = objects;

    for (const object of objects) {
      this.nameIdx.set(object.name, object);
    }
  }

  public get count(): number {
    return this.objects.length;
  }

  public add(...objects: O[]): void {
    for (const object of objects) {
      this.objects.push(object);
      this.nameIdx.set(object.name, object);
    }
  }

  public delete(...objects: O[]): void {
    for (const object of objects) {
      this.objects = this.objects.filter((o) => o !== object);
      this.nameIdx.delete(object.name);
    }
  }

  public deleteAll(): void {
    this.objects = [];
    this.nameIdx.clear();
  }

  public get(name: identifier): O | undefined {
    return this.nameIdx.get(name);
  }

  public has(name: identifier): boolean {
    return this.nameIdx.has(name);
  }

  public toArray(): O[] {
    return this.objects.slice();
  }
}
