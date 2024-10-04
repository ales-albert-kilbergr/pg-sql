/* eslint-disable @typescript-eslint/no-magic-numbers */
import { IsNumber } from 'class-validator';
import { ArgsMap } from './args-map';
import { InvalidArgsException } from './invalid-args.exception';
import { right } from 'fp-ts/Either';

describe('(Unit) ArgsMap', () => {
  describe('setArg', () => {
    it('should set the value of the argument', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      argsMap.setArg('foo', 'bar');
      // Assert
      expect(argsMap.getArg('foo')).toBe('bar');
    });

    it('should return the instance of the ArgsMap', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.setArg('foo', 'bar');
      // Assert
      expect(result).toBe(argsMap);
    });

    it('should take the args from args schema and trigger a typescript error if the property does not exist', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      // Assert
      // @ts-expect-error Property 'bar' does not exist on type 'MyArgs'.
      argsMap.setArg('bar', 'baz');
    });
  });

  describe('getArg', () => {
    it('should return the value of the argument', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArg('foo', 'bar');
      // Act
      const result = argsMap.getArg('foo');
      // Assert
      expect(result).toBe('bar');
    });

    it('should return undefined if the argument is not set', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.getArg('foo');
      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('setArgs', () => {
    it('should set all the arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      argsMap.setArgs({ foo: 'baz', bar: 42 });
      // Assert
      expect(argsMap.getArg('foo')).toBe('baz');
      expect(argsMap.getArg('bar')).toBe(42);
    });

    it('should return the instance of the ArgsMap', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.setArgs({ foo: 'bar' });
      // Assert
      expect(result).toBe(argsMap);
    });

    it('should take the args from args schema and trigger a typescript error if the property does not exist', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      // Assert
      // @ts-expect-error Property 'bar' does not exist on type 'MyArgs'.
      argsMap.setArgs({ bar: 'baz' });
    });

    it('should override the init arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public doo?: string;
      }
      const argsMap = new ArgsMap(MyArgs, { foo: 'bar', doo: 'daz' });
      // Act
      argsMap.setArgs({ foo: 'baz' });
      // Assert
      expect(argsMap.getArg('foo')).toBe('baz');
      expect(argsMap.getArg('doo')).toBeUndefined();
    });
  });

  describe('mergeArgs', () => {
    it('should merge the arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      argsMap.mergeArgs({ foo: 'baz', bar: 42 });
      // Assert
      expect(argsMap.getArg('foo')).toBe('baz');
      expect(argsMap.getArg('bar')).toBe(42);
    });

    it('should return the instance of the ArgsMap', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.mergeArgs({ foo: 'bar' });
      // Assert
      expect(result).toBe(argsMap);
    });

    it('should take the args from args schema and trigger a typescript error if the property does not exist', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      // Assert
      // @ts-expect-error Property 'bar' does not exist on type 'MyArgs'.
      argsMap.mergeArgs({ bar: 'baz' });
    });

    it('should override the init arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public doo?: string;
      }
      const argsMap = new ArgsMap(MyArgs, { foo: 'bar', doo: 'daz' });
      // Act
      argsMap.mergeArgs({ foo: 'baz' });
      // Assert
      expect(argsMap.getArg('foo')).toBe('baz');
      expect(argsMap.getArg('doo')).toBe('daz');
    });
  });

  describe('getArgs', () => {
    it('should return all the arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArgs({ foo: 'baz', bar: 42 });
      // Act
      const result = argsMap.getArgs();
      // Assert
      expect(result).toEqual({ foo: 'baz', bar: 42 });
    });
  });

  describe('resetArgs', () => {
    it('should reset the arguments to the initial state', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArgs({ foo: 'baz', bar: 42 });
      // Act
      argsMap.resetArgs();
      // Assert
      expect(argsMap.getArgs()).toEqual({});
    });

    it('should return the instance of the ArgsMap', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.resetArgs();
      // Assert
      expect(result).toBe(argsMap);
    });
  });

  describe('build', () => {
    it('should return the built arguments', async () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArgs({ foo: 'baz', bar: 42 });
      // Act
      const result = await argsMap.build();
      // Assert
      expect(result).toEqual(right({ foo: 'baz', bar: 42 }));
    });

    it('should return the instance of the ArgsMap', async () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = await argsMap.build();
      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          right: expect.any(MyArgs),
        }),
      );
    });

    it('should return the exception if the validation fails', async () => {
      // Arrange
      class MyArgs {
        @IsNumber()
        public foo?: string;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArgs({ foo: 'invalid input' });
      // Act
      const result = await argsMap.build();
      // Assert
      expect(result).toEqual(
        expect.objectContaining({ left: expect.any(InvalidArgsException) }),
      );
    });
  });

  describe('extend', () => {
    it('should extend the arguments', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
        public bar?: number;
      }
      class MyExtendedArgs extends MyArgs {
        public baz?: boolean;
      }
      const argsMap = new ArgsMap(MyArgs);
      argsMap.setArgs({ foo: 'baz', bar: 42 });
      // Act
      const result = argsMap.extend(MyExtendedArgs);
      // Assert
      expect(result.getArgs()).toEqual({ foo: 'baz', bar: 42 });
    });

    it('should return the instance of the ArgsMap', () => {
      // Arrange
      class MyArgs {
        public foo?: string;
      }
      class MyExtendedArgs extends MyArgs {
        public bar?: number;
      }
      const argsMap = new ArgsMap(MyArgs);
      // Act
      const result = argsMap.extend(MyExtendedArgs);
      // Assert
      expect(result).toBeInstanceOf(ArgsMap);
    });
  });
});
