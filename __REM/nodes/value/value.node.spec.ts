import { SqlTagParserContext } from '../../parser-context';
import { Value } from './value.node';

describe('(Unit) Value sql node', () => {
  describe('when binding a single value', () => {
    it('should bind a simple string value', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 'test';
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual([value]);
      expect(context.fragments).toEqual(['$1']);
    });

    it('should correctly set the placeholder index', () => {
      // Arrange
      const context = new SqlTagParserContext(
        ['SELECT * FROM users WHERE id = $1 and name = '],
        ['one'],
      );
      const value = 'test';
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual(['one', value]);
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = $1 and name = ',
        '$2',
      ]);
    });

    it('should convert a bigint value to string', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 1n;
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual([value.toString()]);
    });

    it('should convert a null value to NULL', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = null;
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual([]);
      expect(context.fragments).toEqual(['NULL']);
    });

    it('should convert an undefined value to DEFAULT', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = undefined;
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual([]);
      expect(context.fragments).toEqual(['DEFAULT']);
    });
  });

  describe('when binding an array of values', () => {
    it('should convert all Bigint values in an array to string', () => {
      // Arrange
      const context = new SqlTagParserContext();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const value = [1n, 2n];
      // Act
      Value(value)(context);
      // Assert
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(context.values[0]).toEqual(value.map((v) => v.toString()));
    });

    it('should bind an array of strings as a single value', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = ['one', 'two'];
      // Act
      Value(value)(context);
      // Assert
      expect(context.values).toEqual([value]);
      expect(context.fragments).toEqual(['$1']);
    });

    it('should bind an array of strings as a spread value', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = ['one', 'two'];
      // Act
      Value(value, { spreadValues: true })(context);
      // Assert
      expect(context.values).toEqual(value);
      expect(context.fragments).toEqual(['$1, $2']);
    });

    it('should convert a single value into an array', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 'one';
      // Act
      Value(value, { spreadValues: true })(context);
      // Assert
      expect(context.values).toEqual([value]);
      expect(context.fragments).toEqual(['$1']);
    });

    it('should convert a null value to NULL', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = [null];
      // Act
      Value(value, { spreadValues: true })(context);
      // Assert
      expect(context.values).toEqual([]);
      expect(context.fragments).toEqual(['NULL']);
    });

    it('should convert an undefined value to DEFAULT', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = [undefined];
      // Act
      Value(value, { spreadValues: true })(context);
      // Assert
      expect(context.values).toEqual([]);
      expect(context.fragments).toEqual(['DEFAULT']);
    });
  });
});
