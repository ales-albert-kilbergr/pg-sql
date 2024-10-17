import { formatSqlText } from '../helpers';
import { renderIfNotExists } from './keyword-flag.renderer';

describe('(Unit) renderKeywordFlag', () => {
  describe('renderIfNotExists', () => {
    it('should return "IF NOT EXISTS" if true is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(true),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('IF NOT EXISTS');
    });

    it('should return an empty string if false is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(false),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('');
    });

    it('should return an empty string if undefined is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(undefined),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('');
    });
  });

  describe('renderIfExists', () => {
    it('should return "IF EXISTS" if true is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(true),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('IF NOT EXISTS');
    });

    it('should return an empty string if false is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(false),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('');
    });

    it('should return an empty string if undefined is provided.', () => {
      // Arrange
      // Act
      const result = formatSqlText(
        renderIfNotExists(undefined),
        formatSqlText.REMOVE_ALL_OPTIONS,
      );
      // Assert
      expect(result).toBe('');
    });
  });
});
