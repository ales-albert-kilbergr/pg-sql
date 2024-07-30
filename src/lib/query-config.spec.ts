import { QueryConfig } from './query-config';

describe('(Unit) QueryConfig', () => {
  describe('constructor', () => {
    it('should create a new instance with the provided text and values', () => {
      // Arrange
      const text = 'SELECT * FROM users WHERE id = $1';
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const values = [1];
      // Act
      const queryConfig = new QueryConfig(text, values);
      // Assert
      expect(queryConfig.text).toBe(text);
      expect(queryConfig.values).toEqual(values);
    });

    it('should create a new instance with an empty text and values', () => {
      // Act
      const queryConfig = new QueryConfig();
      // Assert
      expect(queryConfig.text).toBe('');
      expect(queryConfig.values).toEqual([]);
    });

    it('should generate a random ID as uuid upon initialization', () => {
      // Act
      const queryConfig = new QueryConfig();
      // Assert
      expect(queryConfig.id).toEqual(expect.any(String));
    });
  });

  describe('clone', () => {
    it('should return a new instance with the same text and values', () => {
      // Arrange
      const queryConfig = new QueryConfig('SELECT * FROM users WHERE id = $1', [
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        1,
      ]);
      // Act
      const clone = queryConfig.clone();
      // Assert
      expect(clone).not.toBe(queryConfig);
      expect(clone.text).toBe(queryConfig.text);
      expect(clone.values).toEqual(queryConfig.values);
    });
  });
});
