import { TableMetadata } from './table.metadata';
export function Nullable() {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            TableMetadata.getMetadata(target.constructor).defineNullable(propertyKey);
        }
    };
}
//# sourceMappingURL=nullable.decorator.js.map