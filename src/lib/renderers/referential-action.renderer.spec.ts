import { formatSqlText } from '../helpers';
import {
  Identifier,
  type ReferentialAction,
  ReferentialActionDiscriminant,
} from '../model';
import { renderReferentialAction } from './referential-action.renderer';

describe('(Unit) renderReferentialAction', () => {
  it('should render the action with "NO ACTION" options', () => {
    // Arrange
    const action: ReferentialAction<ReferentialActionDiscriminant.NO_ACTION> = {
      type: ReferentialActionDiscriminant.NO_ACTION,
    };
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    renderReferentialAction(action);
    // Assert
    expect(result).toBe('NO ACTION');
  });

  it('should render the action with "CASCADE" options', () => {
    // Arrange
    const action: ReferentialAction<ReferentialActionDiscriminant.CASCADE> = {
      type: ReferentialActionDiscriminant.CASCADE,
    };
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('CASCADE');
  });

  it('should render the action with "RESTRICT" options', () => {
    // Arrange
    const action: ReferentialAction<ReferentialActionDiscriminant.RESTRICT> = {
      type: ReferentialActionDiscriminant.RESTRICT,
    };
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('RESTRICT');
  });

  it('should render the action with "SET NULL" options', () => {
    // Arrange
    const action: ReferentialAction<ReferentialActionDiscriminant.SET_NULL> = {
      type: ReferentialActionDiscriminant.SET_NULL,
      columns: [Identifier('column')],
    };
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('SET NULL ("column")');
  });

  it('should render the action with "SET DEFAULT" options', () => {
    // Arrange
    const action: ReferentialAction<ReferentialActionDiscriminant.SET_DEFAULT> =
      {
        type: ReferentialActionDiscriminant.SET_DEFAULT,
        columns: [Identifier('column')],
      };
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('SET DEFAULT ("column")');
  });

  it('should return an empty string if the action is undefined', () => {
    // Arrange
    const action = undefined;
    // Act
    const result = formatSqlText(
      renderReferentialAction(action),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
    // Assert
    expect(result).toBe('');
  });
});
