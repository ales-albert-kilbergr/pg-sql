/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DatabaseObject } from './database-object';
import { DatabaseObjectList } from './database-object-list';

describe('(Unit) DatabaseObjectList', () => {
  describe('count', () => {
    it('should return the number of objects in the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList();

      // Act
      const result = objectList.count;

      // Assert
      expect(result).toBe(0);
    });

    it('should return the number of objects in the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList([new DatabaseObject('test')]);

      // Act
      const result = objectList.count;

      // Assert
      expect(result).toBe(1);
    });

    it('should return the number of objects in the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList([
        new DatabaseObject('test'),
        new DatabaseObject('test2'),
      ]);

      // Act
      const result = objectList.count;

      // Assert
      expect(result).toBe(2);
    });
  });

  describe('add', () => {
    it('should add objects to the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList();

      // Act
      objectList.add(new DatabaseObject('test'));

      // Assert
      expect(objectList.count).toBe(1);
    });

    it('should add objects to the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList();

      // Act
      objectList.add([new DatabaseObject('test'), new DatabaseObject('test2')]);

      // Assert
      expect(objectList.count).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete objects from the list', () => {
      // Arrange
      const object = new DatabaseObject('test');
      const objectList = new DatabaseObjectList([object]);

      // Act
      objectList.delete(object);

      // Assert
      expect(objectList.count).toBe(0);
    });

    it('should delete objects from the list', () => {
      // Arrange
      const object = new DatabaseObject('test');
      const objectList = new DatabaseObjectList([
        object,
        new DatabaseObject('test2'),
      ]);

      // Act
      objectList.delete(object);

      // Assert
      expect(objectList.count).toBe(1);
    });

    it('should delete an object by name from the list', () => {
      // Arrange
      const object = new DatabaseObject('test');
      const objectList = new DatabaseObjectList([object]);

      // Act
      objectList.delete('test');

      // Assert
      expect(objectList.count).toBe(0);
    });

    it('should delete more objects with their names', () => {
      // Arrange
      const objectList = new DatabaseObjectList([
        new DatabaseObject('test'),
        new DatabaseObject('test2'),
      ]);

      // Act
      objectList.delete(['test', 'test2']);

      // Assert
      expect(objectList.count).toBe(0);
    });
  });

  describe('deleteAll', () => {
    it('should delete all objects from the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList([
        new DatabaseObject('test'),
        new DatabaseObject('test2'),
      ]);

      // Act
      objectList.deleteAll();

      // Assert
      expect(objectList.count).toBe(0);
    });
  });

  describe('get', () => {
    it('should return an object by name', () => {
      // Arrange
      const object = new DatabaseObject('test');
      const objectList = new DatabaseObjectList([object]);

      // Act
      const result = objectList.get('test');

      // Assert
      expect(result).toBe(object);
    });

    it('should return undefined when an object is not found', () => {
      // Arrange
      const objectList = new DatabaseObjectList();

      // Act
      const result = objectList.get('test');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true when an object is found by name', () => {
      // Arrange
      const object = new DatabaseObject('test');
      const objectList = new DatabaseObjectList([object]);

      // Act
      const result = objectList.has('test');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when an object is not found by name', () => {
      // Arrange
      const objectList = new DatabaseObjectList();

      // Act
      const result = objectList.has('test');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('iterable', () => {
    it('should allow to iterate over the list', () => {
      // Arrange
      const objectList = new DatabaseObjectList([
        new DatabaseObject('test'),
        new DatabaseObject('test2'),
      ]);

      // Act
      const result = Array.from(objectList);

      // Assert
      expect(result.length).toBe(2);
    });
  });
});
