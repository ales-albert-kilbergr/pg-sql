import { formatSqlText } from './format-sql-string';

describe('(Unit) formatSqlText', () => {
  describe('when removing comments', () => {
    it('should remove a comment from the middle of the line', () => {
      // Arrange
      const text = 'SELECT * FROM users -- WHERE id = $1';
      // Act
      const result = formatSqlText(text, { removeComments: true });

      // Assert
      expect(result).toBe('SELECT * FROM users ');
    });

    it('should not remove an EOL if the comment is at the end of the line', () => {
      // Arrange
      const text =
        'SELECT\n' +
        'colOne -- some comment\n' +
        'colTwo -- another comment\n' +
        'FROM users';
      // Act
      const result = formatSqlText(text, { removeComments: true });
      // Assert
      expect(result).toBe(
        'SELECT\n' + 'colOne \n' + 'colTwo \n' + 'FROM users',
      );
    });

    it('should remove an EOL if the comment starts at the beginning of the line', () => {
      // Arrange
      const text = 'SELECT\n' + '-- some comment\n' + 'colOne\n' + 'FROM users';
      // Act
      const result = formatSqlText(text, { removeComments: true });
      // Assert
      expect(result).toBe('SELECT\n' + 'colOne\n' + 'FROM users');
    });

    it('should remove all comments from a multiline SQL text', () => {
      // Arrange
      const text =
        'SELECT * FROM users\n' + '-- my comment\n' + 'WHERE id = $1';
      // Act
      const result = formatSqlText(text, { removeComments: true });
      // Assert
      expect(result).toBe('SELECT * FROM users\nWHERE id = $1');
    });
  });

  describe('when removing EOL characters', () => {
    it('should remove all EOL characters', () => {
      // Arrange
      const text = 'SELECT \ncolOne \nFROM users \nWHERE id = $1';
      // Act
      const result = formatSqlText(text, { removeEOL: true });
      // Assert
      expect(result).toBe('SELECT colOne FROM users WHERE id = $1');
    });
  });

  describe('when removing multiple spaces', () => {
    it('should remove all occurrences of more than one space character in a singleline SQL text', () => {
      // Arrange
      const text = 'SELECT  *  FROM users WHERE id = $1';
      // Act
      const result = formatSqlText(text, { removeMultiSpaces: true });
      // Assert
      expect(result).toBe('SELECT * FROM users WHERE id = $1');
    });

    it('should remove all occurrences of more than one space character in a multiline SQL text', () => {
      // Arrange
      const text = 'SELECT  *\nFROM users  WHERE id = $1';
      // Act
      const result = formatSqlText(text, { removeMultiSpaces: true });
      // Assert
      expect(result).toBe('SELECT *\nFROM users WHERE id = $1');
    });

    it('should remove the multiple spaces at the beginning and end of the text', () => {
      // Arrange
      const text = '   SELECT * FROM users WHERE id = $1   ';
      // Act
      const result = formatSqlText(text, { removeMultiSpaces: true });
      // Assert
      expect(result).toBe(' SELECT * FROM users WHERE id = $1 ');
    });

    it('should remove the multiple spaces at the beginning and end of each line', () => {
      // Arrange
      const text =
        '   SELECT * FROM users WHERE id = $1   \n   ORDER BY name   ';
      // Act
      const result = formatSqlText(text, { removeMultiSpaces: true });
      // Assert
      expect(result).toBe(
        ' SELECT * FROM users WHERE id = $1 \n ORDER BY name ',
      );
    });
  });

  describe('when removing trailing spaces', () => {
    it('should remove trailing space after opening characters', () => {
      // Arrange
      const text = 'SELECT * FROM users WHERE id = $1 ';
      // Act
      const result = formatSqlText(text, { removeTrailingSpaces: true });
      // Assert
      expect(result).toBe('SELECT * FROM users WHERE id = $1');
    });

    it('should remove trailing space around brackets', () => {
      // Arrange
      const text = 'SELECT * FROM users\n WHERE id IN ( $1, $2 )';
      // Act
      const result = formatSqlText(text, { removeTrailingSpaces: true });
      // Assert
      expect(result).toBe('SELECT * FROM users\n WHERE id IN ($1, $2)');
    });
  });
});
