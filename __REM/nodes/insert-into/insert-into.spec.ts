import { SqlTagParserContext } from '../../parser-context';
import { InsertInto } from './insert-into';

describe('(Unit) InsertInto', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the INSERT INTO keyword and table name to the context', () => {
    // Arrange
    const table = 'users';
    const insertInto = InsertInto(table);

    // Act
    insertInto(context);

    // Assert
    expect(context.toSqlText()).toBe('INSERT INTO "users"');
  });

  it('should add the alias to the context if it is provided', () => {
    // Arrange
    const table = 'users';
    const alias = 'u';
    const insertInto = InsertInto(table, alias);

    // Act
    insertInto(context);

    // Assert
    expect(context.toSqlText()).toBe('INSERT INTO "users" AS "u"');
  });
});
