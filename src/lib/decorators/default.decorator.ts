import { TableMetadata } from './table.metadata';

export function Default(defaultExpression: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    if (typeof propertyKey === 'string') {
      TableMetadata.getMetadata(target.constructor).defineDefault(
        propertyKey,
        defaultExpression,
      );
    }
  };
}
