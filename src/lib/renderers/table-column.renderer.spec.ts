/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Database, Identifier, type Table } from '../model';
import { renderTableColumn } from './table-column.renderer';
describe('(Unit) renderTableColumn', () => {
  let table: Table;
  let database: Database;

  beforeEach(() => {
    database = new Database(Identifier('test'));
    table = database.schemas
      .get(Identifier('public'))!
      .defineTable(Identifier('test'));
  });

  it('should return an empty string if the column is undefined', () => {
    // Arrange
    // Act
    const result = renderTableColumn(undefined);
    // Assert
    expect(result).toBe('');
  });

  it('should render the column basic definition', () => {
    // Arrange
    const column = table.defineColumn(
      database.dataTypes.getText(),
      Identifier('id'),
    );
    // Act
    const result = renderTableColumn(column);
    // Assert
    expect(result).toBe('"id" TEXT NOT NULL');
  });

  it('should render the column with a default value', () => {
    // Arrange
    const column = table.defineColumn(
      database.dataTypes.getText(),
      Identifier('id'),
    );
    column.defineDefault({ expression: 'now()' });
    // Act
    const result = renderTableColumn(column);
    // Assert
    expect(result).toBe('"id" TEXT NOT NULL DEFAULT now()');
  });
});
