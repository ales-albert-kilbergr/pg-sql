import { renderKeyword } from './keyword.renderer';

describe('(Unit) renderKeyword', () => {
  it('should return an empty string if the keyword is undefined', () => {
    // Arrange
    const keyword = undefined;
    // Act
    const result = renderKeyword(keyword);
    // Assert
    expect(result).toBe('');
  });

  it('should return an empty string if the keyword is an empty string', () => {
    // Arrange
    const keyword = '';
    // Act
    const result = renderKeyword(keyword);
    // Assert
    expect(result).toBe('');
  });

  it('should return the keyword in uppercase if the keyword is a string', () => {
    // Arrange
    const keyword = 'keyword';
    // Act
    const result = renderKeyword(keyword);
    // Assert
    expect(result).toBe(' KEYWORD ');
  });
});
