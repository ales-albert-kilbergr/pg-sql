import { SqlTagParserContext } from '../../parser-context';
import { Literal } from './literal.node';

describe('(Unit) Literal sql node', () => {
  describe('when binding a single value', () => {
    it('should bind a simple string value', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 'test';
      // Act
      Literal(value)(context);
      // Assert
      expect(context.fragments).toEqual([`'${value}'`]);
    });

    it('should correctly set the placeholder index', () => {
      // Arrange
      const context = new SqlTagParserContext(
        ['SELECT * FROM users WHERE id = $1 and name = '],
        ['one'],
      );
      const value = 'test';
      // Act
      Literal(value)(context);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = $1 and name = ',
        `'${value}'`,
      ]);
    });

    it('should convert a bigint value to string', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 1n;
      // Act
      Literal(value)(context);
      // Assert
      expect(context.fragments).toEqual([`'${value.toString()}'`]);
    });

    it('should convert a null value to NULL', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = null;
      // Act
      Literal(value)(context);
      // Assert
      expect(context.fragments).toEqual(['NULL']);
    });

    it('should convert an undefined value to DEFAULT', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = undefined;
      // Act
      Literal(value)(context);
      // Assert
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
      Literal(value)(context);
      // Assert
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(context.fragments).toEqual([`'{"1","2"}'`]);
    });

    it('should bind an array of strings as a single value', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = ['one', 'two'];
      // Act
      Literal(value)(context);
      // Assert
      expect(context.fragments).toEqual([`'{"one","two"}'`]);
    });

    it('should spread an array of values', () => {
      // Arrange
      const context = new SqlTagParserContext();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const value = [1, 2, 3];
      // Act
      Literal(value, { spreadValues: true })(context);
      // Assert
      expect(context.fragments.join('')).toEqual("'1', '2', '3'");
    });

    it('should deal with a single value in an array', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = 'one';
      // Act
      Literal(value, { spreadValues: true })(context);
      // Assert
      expect(context.fragments).toEqual([`'one'`]);
    });

    it('should deal with a single null value in an array', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = null;
      // Act
      Literal(value, { spreadValues: true })(context);
      // Assert
      expect(context.fragments).toEqual(['NULL']);
    });

    it('should deal with a single undefined value in an array', () => {
      // Arrange
      const context = new SqlTagParserContext();
      const value = undefined;
      // Act
      Literal(value, { spreadValues: true })(context);
      // Assert
      expect(context.fragments).toEqual(['DEFAULT']);
    });
  });
});
