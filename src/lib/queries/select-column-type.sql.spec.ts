import {
  type SelectColumnTypeArgs,
  SelectColumnTypeSql,
} from './select-column-type.sql';

describe('(Unit) SelectColumnType', () => {
  it('should build a correct sql query text', () => {
    // Arrange
    const args: SelectColumnTypeArgs = {
      schema: 'testSchemaName',
      table: 'testTableName',
      column: 'testColumnName',
    };
    // Act
    const result = SelectColumnTypeSql(args);

    console.log(result);
    // Assert
    expect(result).toMatchObject({
      text: 'SELECT data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 AND column_name = $3;',
      values: ['testSchemaName', 'testTableName', 'testColumnName'],
    });
  });
});
