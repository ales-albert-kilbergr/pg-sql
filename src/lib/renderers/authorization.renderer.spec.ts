import { formatSqlText } from '../helpers';
import { renderAuthorization } from './authorization.renderer';

describe('(Unit) renderAuthorization', () => {
  it('should render the AUTHORIZATION keyword and a user name', () => {
    // Arrange
    const authorization = 'user_name';

    // Act
    const text = formatSqlText(
      renderAuthorization(authorization),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(text).toBe(`AUTHORIZATION "${authorization}"`);
  });

  it('should render the AUTHORIZATION keyword and a CURRENT_ROLE as keyword too', () => {
    // Arrange
    const authorization = 'CURRENT_ROLE';

    // Act
    const text = formatSqlText(
      renderAuthorization(authorization),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(text).toBe(`AUTHORIZATION CURRENT_ROLE`);
  });

  it('should render the AUTHORIZATION keyword and a CURRENT_USER as keyword too', () => {
    // Arrange
    const authorization = 'CURRENT_USER';

    // Act
    const text = formatSqlText(
      renderAuthorization(authorization),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(text).toBe(`AUTHORIZATION CURRENT_USER`);
  });

  it('should render the AUTHORIZATION keyword and a SESSION_USER as keyword too', () => {
    // Arrange
    const authorization = 'SESSION_USER';

    // Act
    const text = formatSqlText(
      renderAuthorization(authorization),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(text).toBe(`AUTHORIZATION SESSION_USER`);
  });

  it('should not render anything if the authorization is undefined', () => {
    // Arrange
    const authorization = undefined;

    // Act
    const text = formatSqlText(
      renderAuthorization(authorization),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(text).toBe('');
  });
});
