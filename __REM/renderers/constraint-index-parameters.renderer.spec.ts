import { formatSqlText } from '../helpers';
import { Identifier, type ConstraintIndexParameters } from '../model';
import { renderConstraintIndexParameters } from './constraint-index-parameters.renderer';

describe('(Unit) renderIndexParameters', () => {
  it('should return an empty string if the index parameters are undefined', () => {
    // Arrange
    const indexParameters = undefined;
    // Act
    const result = formatSqlText(
      renderConstraintIndexParameters(indexParameters),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('');
  });

  it('should render "INCLUDE" with column names', () => {
    // Arrange
    const indexParameters: ConstraintIndexParameters = {
      include: [Identifier('column1'), Identifier('column2')],
    };
    // Act
    const result = formatSqlText(
      renderConstraintIndexParameters(indexParameters),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('INCLUDE ("column1", "column2")');
  });

  it('should render "WITH" with index parameters', () => {
    // Arrange
    const indexParameters: ConstraintIndexParameters = {
      with: ['index_parameters'],
    };
    // Act
    const result = formatSqlText(
      renderConstraintIndexParameters(indexParameters),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('WITH (index_parameters)');
  });

  it('should render "USING INDEX TABLESPACE" with tablespace name', () => {
    // Arrange
    const indexParameters: ConstraintIndexParameters = {
      usingIndexTablespace: Identifier('tablespace'),
    };
    // Act
    const result = formatSqlText(
      renderConstraintIndexParameters(indexParameters),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('USING INDEX TABLESPACE "tablespace"');
  });
});
