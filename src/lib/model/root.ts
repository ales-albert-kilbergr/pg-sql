import { Database } from '../database/database';
import { DatabaseObjectList } from './database-object';
import type { Pool } from 'pg';

export const DEFAULT_DATABASE_NAME = 'default';

export const databases = new DatabaseObjectList<Database>();

export function defineDatabase(name: string, pool?: Pool): Database {
  const database = new Database(name, pool);

  databases.add(database);

  return database;
}

export function getDefaultDatabase(): Database {
  const database = databases.get(DEFAULT_DATABASE_NAME);

  if (!database) {
    throw new Error(`Default database "${DEFAULT_DATABASE_NAME}" not found.`);
  }

  return database;
}

defineDatabase(DEFAULT_DATABASE_NAME);
