import { TableMetadata, metadata } from './table.metadata';
export function UniqueKey(arg1, arg2) {
    return (target, propertyKey) => {
        if (typeof target === 'function' && Array.isArray(arg1)) {
            const { constraintName: name, ...otherArgs } = arg2 ?? {};
            TableMetadata.getMetadata(target).defineUniqueKey({
                ...otherArgs,
                columns: arg1,
            }, name);
        }
        if (typeof target === 'object' && typeof propertyKey === 'string') {
            const constraintName = typeof arg1 === 'string' ? arg1 : arg2?.constraintName;
            const { columnName, ...otherProps } = ((typeof arg1 === 'string' ? arg2 : arg1) ??
                {});
            TableMetadata.getMetadata(target.constructor).defineUniqueKey({
                columns: [columnName ?? propertyKey],
                ...otherProps,
            }, constraintName);
        }
    };
}
UniqueKey.metadata = metadata;
//# sourceMappingURL=unique-key.decorator.js.map