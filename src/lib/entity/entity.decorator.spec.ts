import { Entity } from './entity.decorator';
describe('(Unit) Entity Decorator', () => {
  it('should set the schema and table for an entity', () => {
    // Arrange & Act
    @Entity('test.test_table')
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyEntity {}
    const metadata = Entity.metadata.get(MyEntity);
    // Assert
    expect(metadata).toEqual({ schema: 'test', table: 'test_table' });
  });

  it('should set the schema and table for an entity with a default schema', () => {
    // Arrange & Act
    @Entity('test_table')
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class MyEntity {}
    const metadata = Entity.metadata.get(MyEntity);
    // Assert
    expect(metadata).toEqual({ schema: 'public', table: 'test_table' });
  });
});
