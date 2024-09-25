import { type identifier, Identifier } from './identifier';

describe('(Unit) Identifier', () => {
  it('should accept a string starting with a letter as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('abcd');
    // Assert
    expect(act).not.toThrow();
  });

  it('should accept a string with an underscore as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('a_bcd');
    // Assert
    expect(act).not.toThrow();
  });

  it('should accept a string with a number as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('a1bcd');
    // Assert
    expect(act).not.toThrow();
  });

  it('should reject a string starting with a number as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('1abcd');
    // Assert
    expect(act).toThrow();
  });

  it('should reject a string with a special character as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('a!bcd');
    // Assert
    expect(act).toThrow();
  });

  it('should reject a string with a space as an identifier', () => {
    // Act
    const act = (): identifier => Identifier('a bcd');
    // Assert
    expect(act).toThrow();
  });

  it('should reject a string with only digits', () => {
    // Act
    const act = (): identifier => Identifier('123');
    // Assert
    expect(act).toThrow();
  });

  it('should reject a string with hyphens', () => {
    // Act
    const act = (): identifier => Identifier('a-bcd');
    // Assert
    expect(act).toThrow();
  });
});
