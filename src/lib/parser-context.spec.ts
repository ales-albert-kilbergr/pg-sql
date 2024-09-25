/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SqlTagParserContext } from './parser-context';
import { QueryConfig } from './query-config';
import { mock } from 'jest-mock-extended';
import type { SqlTemplateNode } from './sql.types';

describe('(Unit) SqlTagParserContext', () => {
  describe('constructor', () => {
    it('should construct a new instance with empty fragments and values', () => {
      // Act
      const context = new SqlTagParserContext();
      // Assert
      expect(context.fragments).toEqual([]);
      expect(context.values).toEqual([]);
    });
  });
  describe('addFragment', () => {
    it('should add a fragment to the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.addFragment(' WHERE id = $1');
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users',
        ' WHERE id = $1',
      ]);
    });

    it('should add multiple fragments to the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.addFragment(' WHERE id = $1', ' AND name = $2');
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users',
        ' WHERE id = $1',
        ' AND name = $2',
      ]);
    });

    it('should return the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      const result = context.addFragment(' WHERE id = $1');
      // Assert
      expect(result).toBe(context);
    });
  });

  describe('addValue', () => {
    it('should add a value to the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.addValue(1);
      // Assert
      expect(context.fragments).toEqual(['SELECT * FROM users', '$1']);
      expect(context.values).toEqual([1]);
    });

    it('should add multiple values to the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.addValue(1, 'Alice');
      // Assert
      expect(context.fragments).toEqual(['SELECT * FROM users', '$1', '$2']);
      expect(context.values).toEqual([1, 'Alice']);
    });

    it('should return the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      const result = context.addValue(1);
      // Assert
      expect(result).toBe(context);
    });
  });

  describe('mergeQueryConfig', () => {
    it('should add a query config to the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      const queryConfig = new QueryConfig(' WHERE id = $1', [1]);
      // Act
      context.mergeQueryConfig(queryConfig);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users',
        ' WHERE id = $1',
      ]);
      expect(context.values).toEqual([1]);
    });

    it('should update the query config binding indexes', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
      ]);
      context.addValue(1);
      const queryConfig = new QueryConfig(' AND name = $1', ['Alice']);
      // Act
      context.mergeQueryConfig(queryConfig);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = ',
        '$1',
        ' AND name = $2',
      ]);
      expect(context.values).toEqual([1, 'Alice']);
    });

    it('should return the context', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      const queryConfig = new QueryConfig(' WHERE id = $1', [1]);
      // Act
      const result = context.mergeQueryConfig(queryConfig);
      // Assert
      expect(result).toBe(context);
    });
  });

  describe('getLastFragment', () => {
    it('should return the last fragment', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
        '$1',
      ]);
      // Act
      const result = context.getLastFragment();
      // Assert
      expect(result).toBe('$1');
    });

    it('should return the first fragment if there are no fragments', () => {
      // Arrange
      const context = new SqlTagParserContext([]);
      // Act
      const result = context.getLastFragment();
      // Assert
      expect(result).toBeUndefined();
    });

    it('should return the first fragment if there is only one fragment', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      const result = context.getLastFragment();
      // Assert
      expect(result).toBe('SELECT * FROM users');
    });
  });

  describe('replaceLastFragment', () => {
    it('should replace the last fragment', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
        '$1',
      ]);
      // Act
      context.replaceLastFragment('$2');
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = ',
        '$2',
      ]);
    });

    it('should return the context', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
        '$1',
      ]);
      // Act
      const result = context.replaceLastFragment('$2');
      // Assert
      expect(result).toBe(context);
    });
  });

  describe('getNextValueIndex', () => {
    it('should return the next value index', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      context.addValue(1);
      // Act
      const result = context.getNextValueIndex();
      // Assert
      expect(result).toBe('$2');
    });

    it('should return the first value index if there are no values', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      const result = context.getNextValueIndex();
      // Assert
      expect(result).toBe('$1');
    });
  });

  describe('parseNode', () => {
    it('should call node.parse if the node has a parse method', () => {
      // Arrange
      const node = mock<SqlTemplateNode>();
      // Act
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      context.parseNode(node);
      // Assert
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(node.toSql).toHaveBeenCalledWith(context);
    });

    it('should merge it if the node is a QueryConfig', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = $1',
      ]);
      context.values = [1];
      const queryConfig = new QueryConfig(' AND age = $1', [42]);
      // Act
      context.parseNode(queryConfig);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = $1',
        ' AND age = $2',
      ]);
      expect(context.values).toEqual([1, 42]);
    });

    it('should bind the values if the last fragment hints an inline array binding', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id IN (',
      ]);
      // Hints an inline array binding
      context.addFragment('...:');
      // Act
      context.parseNode([1, 2, 3]);
      context.addFragment(')');
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id IN (',
        '',
        '$1, $2, $3',
        ')',
      ]);
      expect(context.values).toEqual([1, 2, 3]);
    });

    it('should bind the values if the last fragment hints an inline value binding', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
      ]);
      // Hints an inline value binding
      context.addFragment(':');
      // Act
      context.parseNode(42);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = ',
        '',
        '$1',
      ]);
      expect(context.values).toEqual([42]);
    });

    it('should bind an array as a single value if the last fragment hints an inline value binding', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
      ]);
      // Hints an inline value binding
      context.addFragment(':');
      // Act
      context.parseNode([1, 2, 3]);
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users WHERE id = ',
        '',
        '$1',
      ]);
      expect(context.values).toEqual([[1, 2, 3]]);
    });

    it('should bind an inline literal array value if the last fragment hints an inline array value binding', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
      ]);
      // Hints an inline value binding
      context.addFragment('...:L');
      // Act
      context.parseNode([1, 2, 3]);
      // Assert
      expect(context.fragments.join('')).toEqual(
        "SELECT * FROM users WHERE id = '1', '2', '3'",
      );
      expect(context.values).toEqual([]);
    });

    it('should bind an inline literal value if the last fragment hints an inline value binding', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = ',
      ]);
      // Hints an inline value binding
      context.addFragment(':L');
      // Act
      context.parseNode(42);
      // Assert
      expect(context.fragments.join('')).toEqual(
        "SELECT * FROM users WHERE id = '42'",
      );
      expect(context.values).toEqual([]);
    });

    it('should replace an empty string value with undefined when binding a value', () => {
      // Arrange
      const context = new SqlTagParserContext(['UPDATE users SET name = ']);
      // Hints an inline value binding
      context.addFragment(':');
      // Act
      context.parseNode(undefined);
      // Assert
      expect(context.fragments.join('')).toEqual(
        'UPDATE users SET name = DEFAULT',
      );
      expect(context.values).toEqual([undefined]);
    });

    it('should call the node if it is a function', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      const node = jest.fn();
      // Act
      context.parseNode(node);
      // Assert
      expect(node).toHaveBeenCalledWith(context);
    });

    it('should simply append a node if it is a string', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.parseNode(' WHERE id = $1');
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users',
        ' WHERE id = $1',
      ]);
    });

    it('should simply stringify a node and append it as a fallback', () => {
      // Arrange
      const context = new SqlTagParserContext(['SELECT * FROM users']);
      // Act
      context.parseNode({ toString: () => ' WHERE id = $1' });
      // Assert
      expect(context.fragments).toEqual([
        'SELECT * FROM users',
        ' WHERE id = $1',
      ]);
    });
  });

  describe('from', () => {
    it('should create a context from a template string and nodes', () => {
      // Arrange
      const strings = ['SELECT * FROM users WHERE id = :', ' AND name = :', ''];
      const nodes = [1, 'Alice'];
      // Act
      const context = SqlTagParserContext.from(strings, nodes);
      // Assert
      expect(context.fragments.join('')).toEqual(
        'SELECT * FROM users WHERE id = $1 AND name = $2',
      );
      expect(context.values).toEqual([1, 'Alice']);
    });
  });

  describe('toQueryConfig', () => {
    it('should return a QueryConfig instance', () => {
      // Arrange
      const context = new SqlTagParserContext([
        'SELECT * FROM users WHERE id = $1',
      ]);
      context.values = [1];
      // Act
      const queryConfig = context.toQueryConfig();
      // Assert
      expect(queryConfig).toBeInstanceOf(QueryConfig);
      expect(queryConfig.text).toEqual('SELECT * FROM users WHERE id = $1');
      expect(queryConfig.values).toEqual([1]);
    });
  });
});
