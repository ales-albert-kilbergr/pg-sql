/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SqlTagParserContext } from '../parser-context';
import { renderLiteral, type RenderLiteralArgs } from './literal.renderer';

describe('(Unit) renderLiteral sql node', () => {
  describe('when binding a single value', () => {
    it('should bind a simple string value', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: 'test',
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([`'${String(args.value)}'`]);
    });

    it('should correctly set the placeholder index', () => {
      // Arrange
      const ctx = new SqlTagParserContext(
        ['SELECT * FROM users WHERE id = $1 and name = '],
        ['one'],
      );
      const args: RenderLiteralArgs = {
        value: 'test',
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([
        'SELECT * FROM users WHERE id = $1 and name = ',
        `'test'`,
      ]);
    });

    it('should convert a bigint value to string', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: 1n,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([`'1'`]);
    });

    it('should convert a null value to NULL', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: null,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual(['NULL']);
    });

    it('should convert an undefined value to DEFAULT', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: undefined,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual(['DEFAULT']);
    });
  });

  describe('when binding an array of values', () => {
    it('should convert all Bigint values in an array to string', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: [1n, 2n],
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([`'{"1","2"}'`]);
    });

    it('should bind an array of strings as a single value', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: ['one', 'two'],
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([`'{"one","two"}'`]);
    });

    it('should spread an array of values', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const args: RenderLiteralArgs = {
        value: ['1', '2', '3'],
        spreadValues: true,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments.join('')).toEqual("'1', '2', '3'");
    });

    it('should deal with a single value in an array', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: 'one',
        spreadValues: true,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual([`'one'`]);
    });

    it('should deal with a single null value in an array', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: null,
        spreadValues: true,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual(['NULL']);
    });

    it('should deal with a single undefined value in an array', () => {
      // Arrange
      const ctx = new SqlTagParserContext();
      const args: RenderLiteralArgs = {
        value: undefined,
        spreadValues: true,
      };
      // Act
      renderLiteral(ctx, args);
      // Assert
      expect(ctx.fragments).toEqual(['DEFAULT']);
    });
  });
});
