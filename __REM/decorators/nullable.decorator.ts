import { TableMetadata } from './table.metadata';

export function Nullable(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    if (typeof propertyKey === 'string') {
      TableMetadata.getMetadata(target.constructor).defineNullable(propertyKey);
    }
  };
}
