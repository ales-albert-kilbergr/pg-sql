import { DataType, DataTypeDiscriminant } from '../model';
import {
  getAuthorizationSql,
  getCascadeSql,
  getDataTypeSql,
  getDefaultExpressionSql,
  getIfNotExistsSql,
  getNullableSql,
  getReturningSql,
  getSchemaQualifiedName,
  type SchemaOwnedObjectFragment,
} from './common.sql';

describe('(Unit) getIfNotExistsSql', () => {
  it('should return empty string when ifNotExists is false', () => {
    // Arrange
    const ifNotExists = false;

    // Act
    const result = getIfNotExistsSql(ifNotExists);

    // Assert
    expect(result).toBe('');
  });

  it('should return "IF NOT EXISTS" when ifNotExists is true', () => {
    // Arrange
    const ifNotExists = true;

    // Act
    const result = getIfNotExistsSql(ifNotExists);

    // Assert
    expect(result).toBe('IF NOT EXISTS');
  });
});

describe('(Unit) getIfExistsSql', () => {
  it('should return empty string when ifExists is false', () => {
    // Arrange
    const ifExists = false;

    // Act
    const result = getIfNotExistsSql(ifExists);

    // Assert
    expect(result).toBe('');
  });

  it('should return "IF EXISTS" when ifExists is true', () => {
    // Arrange
    const ifExists = true;

    // Act
    const result = getIfNotExistsSql(ifExists);

    // Assert
    expect(result).toBe('IF NOT EXISTS');
  });
});

describe('(Unit) getCascadeSql', () => {
  it('should return "RESTRICT" when cascade is false', () => {
    // Arrange
    const cascade = false;

    // Act
    const result = getCascadeSql(cascade);

    // Assert
    expect(result).toBe('RESTRICT');
  });

  it('should return "CASCADE" when cascade is true', () => {
    // Arrange
    const cascade = true;

    // Act
    const result = getCascadeSql(cascade);

    // Assert
    expect(result).toBe('CASCADE');
  });
});

describe('(Unit) getNullableSql', () => {
  it('should return "NULL" when nullable is true', () => {
    // Arrange
    const nullable = true;

    // Act
    const result = getNullableSql(nullable);

    // Assert
    expect(result).toBe('NULL');
  });

  it('should return "NOT NULL" when nullable is false', () => {
    // Arrange
    const nullable = false;

    // Act
    const result = getNullableSql(nullable);

    // Assert
    expect(result).toBe('NOT NULL');
  });
});

describe('(Unit) getDefaultExpressionSql', () => {
  it('should return empty string when defaultExpression is not provided', () => {
    // Arrange
    const defaultExpression = undefined;

    // Act
    const result = getDefaultExpressionSql(defaultExpression);

    // Assert
    expect(result).toBe('');
  });

  it('should return "DEFAULT 42" when defaultExpression is "42"', () => {
    // Arrange
    const defaultExpression = '42';

    // Act
    const result = getDefaultExpressionSql(defaultExpression);

    // Assert
    expect(result).toBe('DEFAULT 42');
  });
});

describe('(Unit) getAuthorizationSql', () => {
  it('should return empty string when roleSpecification is not provided', () => {
    // Arrange
    const roleSpecification = undefined;

    // Act
    const result = getAuthorizationSql(roleSpecification);

    // Assert
    expect(result).toBe('');
  });

  it('should return "AUTHORIZATION CURRENT_USER" when roleSpecification is "CURRENT_USER"', () => {
    // Arrange
    const roleSpecification = 'CURRENT_USER';

    // Act
    const result = getAuthorizationSql(roleSpecification);

    // Assert
    expect(result).toBe('AUTHORIZATION CURRENT_USER');
  });

  it('should return "AUTHORIZATION SESSION_USER" when roleSpecification is "SESSION_USER"', () => {
    // Arrange
    const roleSpecification = 'SESSION_USER';

    // Act
    const result = getAuthorizationSql(roleSpecification);

    // Assert
    expect(result).toBe('AUTHORIZATION SESSION_USER');
  });

  it('should return "AUTHORIZATION USER" when roleSpecification is "USER"', () => {
    // Arrange
    const roleSpecification = 'USER';

    // Act
    const result = getAuthorizationSql(roleSpecification);

    // Assert
    expect(result).toBe('AUTHORIZATION USER');
  });

  it('should return "AUTHORIZATION my_role" when roleSpecification is "my_role"', () => {
    // Arrange
    const roleSpecification = 'my_role';

    // Act
    const result = getAuthorizationSql(roleSpecification);

    // Assert
    expect(result).toBe('AUTHORIZATION "my_role"');
  });
});

describe('(Unit) getDataTypeSql', () => {
  it('should return "BIGINT" when data type is BIGINT', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.BIGINT);

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('BIGINT');
  });

  it('should return "INTEGER" when data type is INTEGER', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.INTEGER);

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('INTEGER');
  });

  it('should return "SMALLINT" when data type is SMALLINT', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.SMALLINT);

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('SMALLINT');
  });

  it('should return "VARCHAR(255)" when data type is VARCHAR with length 255', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.VARCHAR, {
      length: 255,
    });

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('VARCHAR(255)');
  });

  it('should return "CHAR(255)" when data type is CHAR with length 255', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.CHAR, {
      length: 255,
    });

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('CHAR(255)');
  });

  it('should return "TEXT" when data type is TEXT', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.TEXT);

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('TEXT');
  });

  it('should return "TIMESTAMPTZ" when data type is TIMESTAMPTZ', () => {
    // Arrange
    const dataType = new DataType(DataTypeDiscriminant.TIMESTAMPTZ);

    // Act
    const result = getDataTypeSql(dataType);

    // Assert
    expect(result).toBe('TIMESTAMPTZ');
  });
});

describe('(Unit) getSchemaQualifiedName', () => {
  it('should return "public"."my_table" when table has schema name', () => {
    // Arrange
    const table: SchemaOwnedObjectFragment = {
      name: 'my_table',
      schema: { name: 'public' },
    };

    // Act
    const result = getSchemaQualifiedName(table);

    // Assert
    expect(result).toBe('"public"."my_table"');
  });

  it('should return "my_schema"."my_table" when schema name and table name are provided', () => {
    // Arrange
    const schemaName = 'my_schema';
    const tableName = 'my_table';

    // Act
    const result = getSchemaQualifiedName(schemaName, tableName);

    // Assert
    expect(result).toBe('"my_schema"."my_table"');
  });
});

describe('(Unit) getReturningSql', () => {
  it('should return empty string when columns are not provided', () => {
    // Arrange
    const columns = undefined;

    // Act
    const result = getReturningSql(columns);

    // Assert
    expect(result).toBe('');
  });

  it('should return "RETURNING "id", "name"" when columns are ["id", "name"]', () => {
    // Arrange
    const columns = ['id', 'name'];

    // Act
    const result = getReturningSql(columns);

    // Assert
    expect(result).toBe('RETURNING "id", "name"');
  });
});
