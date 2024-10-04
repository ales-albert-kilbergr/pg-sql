import type { Database } from '../database';

export class CreateDatabaseArgs {
  public database!: Database;

  public withOwner?: string;
}
