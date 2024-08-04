import { toSnakeCase } from './to-snake-case';

describe('(Unit) To Snake Case', () => {
  it('should convert camel case to snake case', () => {
    // Arrange
    const camelCase = 'camelCase';
    // Act
    const snakeCase = toSnakeCase(camelCase);
    // Assert
    expect(snakeCase).toBe('camel_case');
  });
});
