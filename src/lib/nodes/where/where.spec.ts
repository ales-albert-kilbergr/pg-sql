/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SqlTagParserContext } from '../../parser-context';
import { Where } from './where';
import type { Condition } from './where.types';

describe('(Unit) where', () => {
  it('should add nothing to the context if the condition is undefined', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    Where(undefined)(context);
    // Assert
    expect(context.fragments).toEqual([]);
  });

  it('should add nothing to the context if the condition is null', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    Where(null)(context);
    // Assert
    expect(context.fragments).toEqual([]);
  });

  it('should add a simple WHERE id = $1 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition = { id: 1 };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" = $1');
    expect(context.values).toEqual([1]);
  });

  it('should add a simple WHERE name = $1 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition = { name: 'test' };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "name" = $1');
    expect(context.values).toEqual(['test']);
  });

  it('should convert a bigint into a string when adding a simple WHERE id = $1 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition = { id: 1n };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" = $1');
    expect(context.values).toEqual(['1']);
  });

  it('should add a simple WHERE id IN ($1, $2) to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition = { id: [1, 2] };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" IN ($1, $2)');
    expect(context.values).toEqual([1, 2]);
  });

  it('should add a simple WHERE id = $1 AND name = $2 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition = { id: 1, name: 'test' };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" = $1 AND "name" = $2');
    expect(context.values).toEqual([1, 'test']);
  });

  it('should add a simple WHERE id = $1 OR name = $2 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: 1, $or: { name: 'test' } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" = $1 OR "name" = $2');
    expect(context.values).toEqual([1, 'test']);
  });

  it('should add a combined WHERE id = $1 OR (name = $2 AND age = $3) to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: 1, $or: { name: 'test', age: 30 } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual(
      'WHERE "id" = $1 OR ("name" = $2 AND "age" = $3)',
    );
    expect(context.values).toEqual([1, 'test', 30]);
  });

  it('should add a simple WHERE id BETWEEN $1 AND $2 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: { $between: [1, 2] } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" BETWEEN $1 AND $2');
    expect(context.values).toEqual([1, 2]);
  });

  it('should add simple WHERE id > $1 and id < $2 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: { $gt: 1, $lt: 2 } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" > $1 AND "id" < $2');
    expect(context.values).toEqual([1, 2]);
  });

  it('should add simple WHERE id >= $1 and id <= $2 to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: { $gte: 1, $lte: 2 } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" >= $1 AND "id" <= $2');
    expect(context.values).toEqual([1, 2]);
  });

  it('should correctly parse the identifier with a dot', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { 'table.id': 1 };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "table"."id" = $1');
    expect(context.values).toEqual([1]);
  });

  it('should add a simple WHERE id IS NULL to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: null };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" IS NULL');
    expect(context.values).toEqual([]);
  });

  it('should add a simple WHERE id IS NOT NULL to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: { $neq: null } };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" IS NOT NULL');
    expect(context.values).toEqual([]);
  });

  it('should replace a null in the IN clause with NULL', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const condition: Condition = { id: [1, null, 2] };
    // Act
    context.pipe(Where(condition));
    // Assert
    expect(context.toSqlText()).toEqual('WHERE "id" IN ($1, NULL, $2)');
    expect(context.values).toEqual([1, 2]);
  });
});
