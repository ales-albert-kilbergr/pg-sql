import type { Database } from '../database';

export class DropDatabaseArgs {
  public database!: Database;

  public ifExists = false;

  public withForce = false;
}
