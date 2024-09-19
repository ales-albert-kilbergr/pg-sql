import { SqlTagParserContext } from '../../parser-context';
import { SchemaAuthorization } from './schema-authorization';

describe('(Unit) SchemaAuthorization', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the schema authorization to the context', () => {
    // Arrange
    const schemaAuthorization = 'CURRENT_USER';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('AUTHORIZATION CURRENT_USER');
  });

  it('should add the schema authorization with current role', () => {
    // Arrange
    const schemaAuthorization = 'CURRENT_ROLE';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('AUTHORIZATION CURRENT_ROLE');
  });

  it('should add the schema authorization with session user', () => {
    // Arrange
    const schemaAuthorization = 'SESSION_USER';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('AUTHORIZATION SESSION_USER');
  });

  it('should add the schema authorization with a custom string', () => {
    // Arrange
    const schemaAuthorization = 'my_custom_user';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('AUTHORIZATION "my_custom_user"');
  });

  it('should not add the schema authorization to the context if it is undefined', () => {
    // Arrange
    const schemaAuthorization = undefined;

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add the schema authorization to the context if it is null', () => {
    // Arrange
    const schemaAuthorization = null;

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add the schema authorization to the context if it is an empty string', () => {
    // Arrange
    const schemaAuthorization = '';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add the schema authorization to the context if it is a string with only spaces', () => {
    // Arrange
    const schemaAuthorization = ' ';

    // Act
    SchemaAuthorization(schemaAuthorization)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
