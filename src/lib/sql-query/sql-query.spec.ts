/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { QueryResult } from 'pg';
import { SqlQuery } from './sql-query';

describe('(Unit) SqlCommand', () => {
  describe('create', () => {
    it('should return a new SqlCommand instance', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      // Act
      const sqlCommand = SqlQuery.from(MyArgs);
      // Assert
      expect(sqlCommand).toBeInstanceOf(SqlQuery);
    });

    it('should dynamically create a setter/getter for each argument', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      // Act
      const sqlCommand = SqlQuery.from(MyArgs);
      // Assert
      expect(sqlCommand.foo).toBeDefined();
    });

    it('should allow to set/get the value of the argument', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const sqlCommand = SqlQuery.from(MyArgs);
      // Act
      sqlCommand.foo('bar');
      // Assert
      expect(sqlCommand.foo()).toBe('bar');
    });

    it('should take the arg type from the args schema and trigger a typescript error if the property does not exist', () => {
      // Arrange
      class MyArgs {
        public foo?: number;
      }
      const sqlCommand = SqlQuery.from(MyArgs);
      // Act
      // Assert
      // @ts-expect-error Property 'foo' is of type number.
      sqlCommand.foo('baz');
    });

    it('should respect if the type can be undefined', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const sqlCommand = SqlQuery.from(MyArgs);
      // Act
      sqlCommand.foo(void 0);
      // Assert
      expect(sqlCommand.foo()).toBeUndefined();
    });
  });

  describe('useResultParser', () => {
    it('should change the RESULT generic', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const sqlCommand = SqlQuery.from(MyArgs);
      const resultParser: () => number = jest.fn().mockReturnValue(42);
      // Act & Assert
      // Should accept the changed type of the SqlCommand
      const result: SqlQuery<MyArgs, number> =
        sqlCommand.useResultParser(resultParser);

      expect(result).toBe(sqlCommand);
    });

    it('should change the QUERY_RESULT_ROW generic', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const sqlCommand = SqlQuery.from(MyArgs);
      const resultParser: (qr: { my_column: string }[]) => number = jest
        .fn()
        .mockReturnValue(42);
      // Act & Assert
      // Should accept the changed type of the SqlCommand
      const result: SqlQuery<MyArgs, number, never, { my_column: string }> =
        sqlCommand.useResultParser(resultParser);

      expect(result).toBe(sqlCommand);
    });
  });

  describe('useErrorMatcher', () => {
    it('should change the ERROR generic', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class MyError {}
      const sqlCommand = SqlQuery.from(MyArgs);
      const errorMatcher: () => MyError = jest
        .fn()
        .mockReturnValue(new MyError());
      // Act & Assert
      // Should accept the changed type of the SqlCommand
      const result: SqlQuery<MyArgs, QueryResult, MyError> =
        sqlCommand.useErrorMatcher(errorMatcher);

      expect(result).toBe(sqlCommand);
    });
  });
});
