import { renderIdentifier } from './identifier.renderer';

describe('(Unit) renderIdentifier', () => {
  it('should return an empty string if the identifier is undefined', () => {
    // Arrange
    const identifier = undefined;
    // Act
    const result = renderIdentifier(identifier);
    // Assert
    expect(result).toBe('');
  });

  it('should return an empty string if the identifier is an empty string', () => {
    // Arrange
    const identifier = '';
    // Act
    const result = renderIdentifier(identifier);
    // Assert
    expect(result).toBe('');
  });

  it('should return the escaped identifier if the identifier is a string', () => {
    // Arrange
    const identifier = 'identifier';
    // Act
    const result = renderIdentifier(identifier);
    // Assert
    expect(result).toBe('"identifier"');
  });

  it('should return the escaped identifiers if the identifier is an array of strings', () => {
    // Arrange
    const identifier = ['identifier1', 'identifier2'];
    // Act
    const result = renderIdentifier(identifier);
    // Assert
    expect(result).toBe('"identifier1", "identifier2"');
  });
});
