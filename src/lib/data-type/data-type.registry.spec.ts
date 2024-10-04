/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DataType } from './data-type';
import {
  BIGINT_MAX_VALUE,
  BIGINT_MIN_VALUE,
  INTEGER_MAX_VALUE,
  INTEGER_MIN_VALUE,
  SMALLINT_MAX_VALUE,
  SMALLINT_MIN_VALUE,
} from './data-type.const';
import { DataTypeDiscriminant } from './data-type.discriminant';
import { DataTypeRegistry } from './data-type.registry';

describe('(Unit) DataTypeRegistry', () => {
  describe('getBigInt', () => {
    it('should return a BigInt data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getBigInt();
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.BIGINT);
    });

    it('should always return the same identical instance', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getBigInt();
      const result2 = registry.getBigInt();
      // Assert
      expect(result1).toBe(result2);
    });

    it('should parse a string to a BigInt', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getBigInt();
      // Act
      const result = dataType.parse('123');
      // Assert
      expect(result).toBe(BigInt(123));
    });

    it('should serialize a BigInt to a string', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getBigInt();
      // Act
      const result = dataType.serialize(BigInt(123));
      // Assert
      expect(result).toBe('123');
    });

    it('should have a min value of BigInt(-9007199254740991)', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getBigInt();
      // Act
      const result = dataType.getArg('minValue');
      // Assert
      expect(result).toBe(BIGINT_MIN_VALUE);
    });

    it('should have a max value of BigInt(9007199254740991)', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getBigInt();
      // Act
      const result = dataType.getArg('maxValue');
      // Assert
      expect(result).toBe(BIGINT_MAX_VALUE);
    });
  });

  describe('getSmallInt', () => {
    it('should return a SmallInt data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getSmallInt();
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.SMALLINT);
    });

    it('should always return the same identical instance', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getSmallInt();
      const result2 = registry.getSmallInt();
      // Assert
      expect(result1).toBe(result2);
    });

    it('should have a min value of -32768', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getSmallInt();
      // Act
      const result = dataType.getArg('minValue');
      // Assert
      expect(result).toBe(SMALLINT_MIN_VALUE);
    });

    it('should have a max value of 32767', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getSmallInt();
      // Act
      const result = dataType.getArg('maxValue');
      // Assert
      expect(result).toBe(SMALLINT_MAX_VALUE);
    });
  });

  describe('getInt', () => {
    it('should return an Int data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getInt();
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.INTEGER);
    });

    it('should always return the same identical instance', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getInt();
      const result2 = registry.getInt();
      // Assert
      expect(result1).toBe(result2);
    });

    it('should have a min value of -2147483648', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getInt();
      // Act
      const result = dataType.getArg('minValue');
      // Assert
      expect(result).toBe(INTEGER_MIN_VALUE);
    });

    it('should have a max value of 2147483647', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getInt();
      // Act
      const result = dataType.getArg('maxValue');
      // Assert
      expect(result).toBe(INTEGER_MAX_VALUE);
    });
  });

  describe('getVarchar', () => {
    it('should return a Varchar data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getVarchar({ length: 255 });
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.VARCHAR);
    });

    it('should always return the same identical instance for the same length', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getVarchar({ length: 255 });
      const result2 = registry.getVarchar({ length: 255 });
      // Assert
      expect(result1).toBe(result2);
    });

    it('should always return different instances for different lengths', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getVarchar({ length: 255 });
      const result2 = registry.getVarchar({ length: 256 });
      // Assert
      expect(result1).not.toBe(result2);
    });

    it('should let access the length', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getVarchar({ length: 255 });
      // Act
      const result = dataType.getArg('length');
      // Assert
      expect(result).toBe(255);
    });
  });

  describe('getChar', () => {
    it('should return a Char data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getChar({ length: 255 });
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.CHAR);
    });

    it('should always return the same identical instance for the same length', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getChar({ length: 255 });
      const result2 = registry.getChar({ length: 255 });
      // Assert
      expect(result1).toBe(result2);
    });

    it('should always return different instances for different lengths', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getChar({ length: 255 });
      const result2 = registry.getChar({ length: 256 });
      // Assert
      expect(result1).not.toBe(result2);
    });

    it('should let access the length', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getChar({ length: 255 });
      // Act
      const result = dataType.getArg('length');
      // Assert
      expect(result).toBe(255);
    });
  });

  describe('getText', () => {
    it('should return a Text data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getText();
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.TEXT);
    });

    it('should always return the same identical instance', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getText();
      const result2 = registry.getText();
      // Assert
      expect(result1).toBe(result2);
    });
  });

  describe('getTimestamptz', () => {
    it('should return a Timestamptz data type', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result = registry.getTimestamptz();
      // Assert
      expect(result).toBeInstanceOf(DataType);
      expect(result.name).toBe(DataTypeDiscriminant.TIMESTAMPTZ);
    });

    it('should always return the same identical instance', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      // Act
      const result1 = registry.getTimestamptz();
      const result2 = registry.getTimestamptz();
      // Assert
      expect(result1).toBe(result2);
    });

    it('should parse a string to a Date', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getTimestamptz();
      // Act
      const result = dataType.parse('2021-01-01T00:00:00.000Z');
      // Assert
      expect(result).toEqual(new Date('2021-01-01T00:00:00.000Z'));
    });

    it('should serialize a Date to a string', () => {
      // Arrange
      const registry = new DataTypeRegistry();
      const dataType = registry.getTimestamptz();
      // Act
      const result = dataType.serialize(new Date('2021-01-01T00:00:00.000Z'));
      // Assert
      expect(result).toBe('2021-01-01T00:00:00.000Z');
    });
  });
});
