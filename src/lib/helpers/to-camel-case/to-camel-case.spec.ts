import { toCamelCase } from './to-camel-case';

describe('(Unit) To Camel Case', () => {
  it('should convert snake case to camel case', () => {
    // Arrange
    const snakeCase = 'snake_case';
    // Act
    const camelCase = toCamelCase(snakeCase);
    // Assert
    expect(camelCase).toBe('snakeCase');
  });

  it('should convert kebab case to camel case', () => {
    // Arrange
    const kebabCase = 'kebab-case';
    // Act
    const camelCase = toCamelCase(kebabCase);
    // Assert
    expect(camelCase).toBe('kebabCase');
  });

  it('should convert space case to camel case', () => {
    // Arrange
    const spaceCase = 'space case';
    // Act
    const camelCase = toCamelCase(spaceCase);
    // Assert
    expect(camelCase).toBe('spaceCase');
  });
});
