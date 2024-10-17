import { TableMetadata, metadata } from './table.metadata';
export function PrimaryKey(arg1, arg2) {
    return (target, propertyKey) => {
        if (typeof target === 'function' && Array.isArray(arg1)) {
            const { constraintName, ...otherArgs } = arg2 ?? {};
            TableMetadata.getMetadata(target).definePrimaryKey({
                ...otherArgs,
                columns: arg1,
            }, constraintName);
        }
        if (typeof target === 'object' && typeof propertyKey === 'string') {
            const constraintName = typeof arg1 === 'string' ? arg1 : arg2?.constraintName;
            const { columnName, ...otherProps } = ((typeof arg1 === 'string' ? arg2 : arg1) ??
                {});
            const args = {
                columns: [columnName ?? propertyKey],
                ...otherProps,
            };
            TableMetadata.getMetadata(target.constructor).definePrimaryKey(args, constraintName);
        }
    };
}
PrimaryKey.metadata = metadata;
//# sourceMappingURL=primary-key.decorator.js.map