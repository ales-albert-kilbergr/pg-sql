import type { identifier } from '../identifier';
import { escapeIdentifier } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DatabaseObject<P extends DatabaseObject = DatabaseObject<any>> {
  public name: identifier;

  public comment?: string;
  /**
   * Allow to manage additional logic on setting the parent object.
   */
  public parent?: P;

  public constructor(name: identifier, parent?: P) {
    this.name = name;
    this.parent = parent;
  }

  public get escapedName(): string {
    return escapeIdentifier(this.name);
  }

  public get fullName(): string {
    const parentName = this.parent ? this.parent.fullName : '';

    return `${parentName ? `${parentName}.` : ''}${this.name}`;
  }
  /**
   * Get the full escaped name of the object including the parent's name.
   *
   * @returns
   */
  public get escapedFullName(): string {
    const parentName = this.parent ? this.parent.escapedFullName : '';

    return parentName
      ? `${parentName}.${escapeIdentifier(this.name)}`
      : escapeIdentifier(this.name);
  }
}
