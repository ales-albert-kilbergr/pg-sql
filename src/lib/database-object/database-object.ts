// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DatabaseObject<P extends DatabaseObject = DatabaseObject<any>> {
  public name: string;

  public comment?: string;
  /**
   * Allow to manage additional logic on setting the parent object.
   */
  public parent?: P;

  public constructor(name: string, parent?: P) {
    this.name = name;
    this.parent = parent;
  }
}
