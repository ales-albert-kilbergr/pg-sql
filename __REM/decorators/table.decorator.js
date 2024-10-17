import { TableMetadata, metadata } from './table.metadata';
export function Table(name) {
    return (target) => {
        TableMetadata.getMetadata(target).defineTable(name);
    };
}
Table.metadata = metadata;
//# sourceMappingURL=table.decorator.js.map