import { ColumnList, defineTextColumn } from '../model';
import { type CreateTableArgs, CreateTableSql } from './create-table.sql';

describe('(Unit) CreateTableSql', () => {
  it('should create a CREATE TABLE query', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" ("id" TEXT NOT NULL , "name" TEXT NOT NULL);',
    );
  });

  it('should create a table with a primary key', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
      primaryKey: {
        table: 'users',
        columns: ['id'],
      },
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" (' +
        '"id" TEXT NOT NULL , ' +
        '"name" TEXT NOT NULL , ' +
        'CONSTRAINT "pk_users" PRIMARY KEY ("id")' +
        ');',
    );
  });

  it('should create a table with multi-column primary key', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
      primaryKey: {
        table: 'users',
        columns: ['id', 'name'],
      },
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" (' +
        '"id" TEXT NOT NULL , ' +
        '"name" TEXT NOT NULL , ' +
        'CONSTRAINT "pk_users" PRIMARY KEY ("id", "name")' +
        ');',
    );
  });

  it('should create a primary key with a custom name', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
      primaryKey: {
        table: 'users',
        columns: ['id'],
        constraintName: 'pk_users_custom',
      },
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" (' +
        '"id" TEXT NOT NULL , ' +
        '"name" TEXT NOT NULL , ' +
        'CONSTRAINT "pk_users_custom" PRIMARY KEY ("id")' +
        ');',
    );
  });

  it('should create a table with a unique constraint', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
      uniqueConstraints: [
        {
          table: 'users',
          constraintName: 'uc_users_id',
          columns: ['id'],
        },
      ],
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" (' +
        '"id" TEXT NOT NULL , ' +
        '"name" TEXT NOT NULL , ' +
        'CONSTRAINT "uc_users_id" UNIQUE ("id")' +
        ');',
    );
  });

  it('should create a table with a multi-column unique constraint', () => {
    // Arrange
    const args: CreateTableArgs = {
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
      uniqueConstraints: [
        {
          table: 'users',
          constraintName: 'uc_users_id_name',
          columns: ['id', 'name'],
        },
      ],
    };

    // Act
    const query = CreateTableSql(args);

    // Assert
    expect(query.text).toBe(
      'CREATE TABLE "public"."users" (' +
        '"id" TEXT NOT NULL , ' +
        '"name" TEXT NOT NULL , ' +
        'CONSTRAINT "uc_users_id_name" UNIQUE ("id", "name")' +
        ');',
    );
  });
});
