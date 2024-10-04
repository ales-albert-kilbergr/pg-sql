/* eslint-disable @typescript-eslint/init-declarations */
import { Database, type DataTypeDiscriminant, type Schema } from '../model';
import {
  type CreateSequenceSqlArgs,
  getCreateSequenceSql,
} from './create-sequence.sql';

describe('(Unit) getCreateSequenceSql', () => {
  let database: Database;
  let schema: Schema;

  beforeEach(() => {
    database = new Database('my_database');
    schema = database.defineSchema('my_schema');
  });

  it('should generate a CREATE SEQUENCE statement', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);

    const command: CreateSequenceSqlArgs = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE NO CYCLE NONE;',
    );
  });

  it('should add IF NOT EXISTS clause', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);

    const command: CreateSequenceSqlArgs = {
      sequence,
      ifNotExists: true,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE IF NOT EXISTS "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE NO CYCLE NONE;',
    );
  });

  it('should add MIN and MAX values', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);
    sequence.minValue = 1;
    sequence.maxValue = 100;

    const command: CreateSequenceSqlArgs = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'MINVALUE 1 MAXVALUE 100 NO CYCLE NONE;',
    );
  });

  it('should add START WITH value', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);
    sequence.startValue = 10;

    const command: CreateSequenceSqlArgs = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE START WITH 10 NO CYCLE NONE;',
    );
  });

  it('should add CACHE value', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);
    sequence.cache = 10;

    const command: CreateSequenceSqlArgs = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE CACHE 10 NO CYCLE NONE;',
    );
  });

  it('should add CYCLE option', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence(sequenceName);
    sequence.cycle = true;

    const command: CreateSequenceSqlArgs = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS INTEGER INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE CYCLE NONE;',
    );
  });

  it('should add OWNED BY clause', () => {
    // Arrange
    const sequenceName = 'my_sequence';
    const sequence = schema.defineSequence<DataTypeDiscriminant.BIGINT>(
      sequenceName,
      database.dataTypes.getBigInt(),
    );
    const table = schema.defineTable('my_table');
    const column = table.defineColumn(
      database.dataTypes.getBigInt(),
      'my_column',
    );
    sequence.ownedBy = column;

    const command: CreateSequenceSqlArgs<DataTypeDiscriminant.BIGINT> = {
      sequence,
    };
    // Act
    const result = getCreateSequenceSql(command);
    // Assert
    expect(result).toBe(
      'CREATE SEQUENCE "my_schema"."my_sequence" ' +
        'AS BIGINT INCREMENT BY 1 ' +
        'NO MINVALUE NO MAXVALUE NO CYCLE ' +
        'OWNED BY "my_table"."my_column";',
    );
  });
});
