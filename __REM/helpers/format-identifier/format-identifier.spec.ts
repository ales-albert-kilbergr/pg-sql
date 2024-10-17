import { formatIdentifier } from './format-identifier';

describe('(Unit) Identifier Formatter', () => {
  it('should format an identifier with quotes', () => {
    // Arrange
    const identifier = 'my_identifier';
    // Act
    const result = formatIdentifier(identifier, { useQuotes: true });
    // Assert
    expect(result).toBe('"my_identifier"');
  });

  it('should format an identifier without quotes', () => {
    // Arrange
    const identifier = 'my_identifier';
    // Act
    const result = formatIdentifier(identifier, { useQuotes: false });
    // Assert
    expect(result).toBe('my_identifier');
  });

  it('should format an identifier with a template and without quotes', () => {
    // Arrange
    const identifier = { table: 'my_table' };
    // Act
    const result = formatIdentifier(identifier, {
      useTemplate: '{table}',
      useQuotes: false,
    });
    // Assert
    expect(result).toBe('my_table');
  });

  it('should format an identifier with a template and quotes', () => {
    // Arrange
    const identifier = { table: 'my_table' };
    // Act
    const result = formatIdentifier(identifier, {
      useTemplate: '{table}',
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"my_table"');
  });

  it('should format an identifier with quotes by default', () => {
    // Arrange
    const identifier = 'my_identifier';
    // Act
    const result = formatIdentifier(identifier);
    // Assert
    expect(result).toBe('"my_identifier"');
  });

  it('should format an identifier with schema and table based on a template each with quotes', () => {
    // Arrange
    const identifier = { schema: 'my_schema', table: 'my_table' };
    // Act
    const result = formatIdentifier(identifier, {
      useTemplate: '{schema}.{table}',
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"my_schema"."my_table"');
  });

  it('should format an identifier from a string based chain containing dots with quotes', () => {
    // Arrange
    const identifier = 'my_schema.my_table';
    // Act
    const result = formatIdentifier(identifier);
    // Assert
    expect(result).toBe('"my_schema"."my_table"');
  });

  it('should format an identifier from a string based chain containing dots and transform to sneak case', () => {
    // Arrange
    const identifier = 'MySchema.MyTable';
    // Act
    const result = formatIdentifier(identifier, {
      toSneakCase: true,
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"My_Schema"."My_Table"');
  });

  it('should format an identifier from a string based chain containing dots and transform to lower case', () => {
    // Arrange
    const identifier = 'MySchema.MyTable';
    // Act
    const result = formatIdentifier(identifier, {
      toLowerCase: true,
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"myschema"."mytable"');
  });

  it('should replace the missing template values with empty strings', () => {
    // Arrange
    const identifier = { table: 'my_table' };
    // Act
    const result = formatIdentifier(identifier, {
      useTemplate: '{schema}.{table}',
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"my_table"');
  });

  it('should remove the trailing dots from the beginning and end of the string', () => {
    // Arrange
    const identifier = { schema: 'my_schema', table: 'my_table' };
    // Act
    const result = formatIdentifier(identifier, {
      useTemplate: '.{schema}.{table}.',
      useQuotes: true,
    });
    // Assert
    expect(result).toBe('"my_schema"."my_table"');
  });

  it('should fail to format an identifier from an object if template is not provided', () => {
    // Arrange
    const identifier = { table: 'my_table' };
    // Act
    // @ts-expect-error - forcing to test the error, the method signature should
    //    be enforcing the template to be required
    const act = () => formatIdentifier(identifier);
    // Assert
    expect(act).toThrow(Error);
  });

  it('should to format an identifier from an array', () => {
    // Arrange
    const identifier = ['my_schema', 'my_table'];
    // Act
    const result = formatIdentifier(identifier, { useQuotes: true });
    // Assert
    expect(result).toBe('"my_schema"."my_table"');
  });
});
