import { TableMetadata } from './table.metadata';
export function Default(defaultExpression) {
    return (target, propertyKey) => {
        if (typeof propertyKey === 'string') {
            TableMetadata.getMetadata(target.constructor).defineDefault(propertyKey, defaultExpression);
        }
    };
}
//# sourceMappingURL=default.decorator.js.map