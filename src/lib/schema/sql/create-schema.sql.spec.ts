/* eslint-disable @typescript-eslint/init-declarations */
import { stringRandom } from '@kilbergr/string';
import { CreateSchemaSql, SchemaExistsSql } from '.';
import { Database } from '../../database';
import { SqlQuery } from '../../sql-query';
import { TemporaryDatabase } from '../../temporary-database';
import { Schema } from '../schema';
import type { Pool } from 'pg';
import { right } from 'fp-ts/Either';

describe('(Integration) CreateSchemaSql', () => {
  describe('CreateSchemaSql.getSql', () => {
    let schema: Schema;

    beforeAll(() => {
      const database = new Database('my_db');
      schema = new Schema('my_schema', database);
    });

    it('should return CREATE SCHEMA statement with schema name', () => {
      // Arrange
      const args: CreateSchemaSql.Args = {
        schema,
        ifNotExists: false,
      };

      // Act
      const result = CreateSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('CREATE SCHEMA "my_schema";');
    });

    it('should return CREATE SCHEMA statement with IF NOT EXISTS clause', () => {
      // Arrange
      const args: CreateSchemaSql.Args = {
        schema,
        ifNotExists: true,
      };

      // Act
      const result = CreateSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('CREATE SCHEMA IF NOT EXISTS "my_schema";');
    });

    it('should return CREATE SCHEMA statement with AUTHORIZATION clause', () => {
      // Arrange
      const args: CreateSchemaSql.Args = {
        schema,
        ifNotExists: false,
        authorization: 'my_role',
      };

      // Act
      const result = CreateSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('CREATE SCHEMA AUTHORIZATION "my_role" "my_schema";');
    });

    it('should return CREATE SCHEMA statement with IF NOT EXISTS and AUTHORIZATION clauses', () => {
      // Arrange
      const args: CreateSchemaSql.Args = {
        schema,
        ifNotExists: true,
        authorization: 'my_role',
      };

      // Act
      const result = CreateSchemaSql.getSql(args);

      // Assert
      expect(result).toBe(
        'CREATE SCHEMA IF NOT EXISTS AUTHORIZATION "my_role" "my_schema";',
      );
    });
  });

  describe('create', () => {
    it('should create a sql query with preset schema', () => {
      // Arrange
      const database = new Database('my_db');
      const schema = new Schema('my_schema', database);

      // Act
      const result = CreateSchemaSql.create(schema);

      // Assert
      expect(result).toBeInstanceOf(SqlQuery);
      expect(result.schema()).toBe(schema);
    });
  });

  describe('execution', () => {
    let temporaryDatabase: TemporaryDatabase;
    let pool: Pool;

    beforeAll(async () => {
      temporaryDatabase = TemporaryDatabase.fromEnv('create_schema_test');
      await temporaryDatabase.init();

      pool = temporaryDatabase.getPoolOrFail();
      console.log(pool);
    });

    afterAll(async () => {
      await temporaryDatabase.close();
    });

    it('should create a schema', async () => {
      // Arrange
      const schemaName = `schema_${stringRandom()}`;
      const schema =
        temporaryDatabase.temporaryDatabase.defineSchema(schemaName);
      const createSchemaSqlQuery = CreateSchemaSql.create(schema);
      const existsSchemaSqlQuery = SchemaExistsSql.create(schema);
      // Act
      await createSchemaSqlQuery.execute(pool);
      const exists = await existsSchemaSqlQuery.execute(pool);
      // Assert
      expect(exists).toEqual(right(true));
    });
  });
});
