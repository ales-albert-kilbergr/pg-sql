import { DatabaseObject } from './database-object';

describe('(Unit) DatabaseObject', () => {
  it('should create an instance of the class', () => {
    // Arrange & Act
    const databaseObject = new DatabaseObject('test');

    // Assert
    expect(databaseObject).toBeTruthy();
  });

  it('should have a name', () => {
    // Arrange & Act
    const databaseObject = new DatabaseObject('test');

    // Assert
    expect(databaseObject.name).toBe('test');
  });

  it('should have a parent object', () => {
    // Arrange & Act
    const parent = new DatabaseObject('parent');
    const databaseObject = new DatabaseObject('test', parent);

    // Assert
    expect(databaseObject.parent).toBe(parent);
  });
});
