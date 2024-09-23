import { CreateIndexSql, type CreateIndexSqlArgs } from './create-index.sql';

describe('(Unit) CreateIndexSql', () => {
  it('should create a CREATE INDEX query', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE INDEX "idx_users_name" ON "my_schema"."users" USING btree ("name");',
    );
  });

  it('should create a CREATE UNIQUE INDEX query', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
      unique: true,
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE UNIQUE INDEX "idx_users_name" ON "my_schema"."users" USING btree ("name");',
    );
  });

  it('should create a CREATE INDEX query with concurrently', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
      concurrently: true,
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE INDEX CONCURRENTLY "idx_users_name" ON "my_schema"."users" USING btree ("name");',
    );
  });

  it('should create a CREATE INDEX query with if not exists', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
      ifNotExists: true,
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE INDEX IF NOT EXISTS "idx_users_name" ON "my_schema"."users" USING btree ("name");',
    );
  });

  it('should create a CREATE INDEX query with only', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
      only: true,
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE INDEX "idx_users_name" ON ONLY "my_schema"."users" USING btree ("name");',
    );
  });

  it('should create a CREATE INDEX query with using', () => {
    // Arrange
    const args: CreateIndexSqlArgs = {
      schema: 'my_schema',
      table: 'users',
      name: 'idx_users_name',
      indexedNames: ['name'],
      using: 'gin',
    };

    // Act
    const query = CreateIndexSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE INDEX "idx_users_name" ON "my_schema"."users" USING gin ("name");',
    );
  });
});
