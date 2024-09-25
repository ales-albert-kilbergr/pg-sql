import { renderCreateSchemaCommand } from './create-schema.renderer';
import { CreateSchemaCommand } from '../commands';
import { Database, Identifier, type identifier } from '../model';
import { sql } from '../sql';

describe('(Unit) renderCreateSchemaCommand', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let database: Database;

  beforeEach(() => {
    database = new Database(Identifier('database_name'));
  });

  it('should render the CREATE SCHEMA command', () => {
    // Arrange
    const schemaName: identifier = Identifier('schema_name');
    const schema = database.defineSchema(schemaName);
    const command = new CreateSchemaCommand(schema);
    // Act
    const result = renderCreateSchemaCommand(command);
    // Assert
    expect(result.text).toBe('CREATE SCHEMA "schema_name";');
  });

  it('should render the CREATE SCHEMA IF NOT EXISTS command', () => {
    // Arrange
    const schemaName: identifier = Identifier('schema_name');
    const schema = database.defineSchema(schemaName);
    const command = new CreateSchemaCommand(schema);
    command.ifNotExists = true;
    // Act
    const result = renderCreateSchemaCommand(command);
    // Assert
    expect(result.text).toBe('CREATE SCHEMA IF NOT EXISTS "schema_name";');
  });

  it('should render the CREATE SCHEMA AUTHORIZATION command', () => {
    // Arrange
    const schemaName: identifier = Identifier('schema_name');
    const schema = database.defineSchema(schemaName);
    const command = new CreateSchemaCommand(schema);
    command.authorization = 'user_name';
    // Act
    const result = renderCreateSchemaCommand(command);
    // Assert
    expect(result.text).toBe(
      'CREATE SCHEMA "schema_name" AUTHORIZATION "user_name";',
    );
  });

  it('should render as a part of another query config', () => {
    // Arrange
    const schemaName: identifier = Identifier('schema_name');
    const schema = database.defineSchema(schemaName);
    const command = new CreateSchemaCommand(schema);
    // Act
    const result = sql`${renderCreateSchemaCommand(command)} SELECT 1;`;
    // Assert
    expect(result.text).toBe('CREATE SCHEMA "schema_name"; SELECT 1;');
  });
});
