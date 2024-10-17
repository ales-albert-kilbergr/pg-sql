import { TableMetadata } from './table.metadata';
export function Column(dataType, args) {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            TableMetadata.getMetadata(target.constructor).defineColumn(dataType, {
                propertyKey,
                ...args,
            });
        }
    };
}
export function CreatedAtColumn() {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            TableMetadata.getMetadata(target.constructor).defineCreatedAtColumn(propertyKey);
        }
    };
}
export function UpdatedAtColumn() {
    return function (target, propertyKey) {
        if (typeof propertyKey === 'string') {
            TableMetadata.getMetadata(target.constructor).defineUpdatedAtColumn(propertyKey);
        }
    };
}
//# sourceMappingURL=column.decorator.js.map