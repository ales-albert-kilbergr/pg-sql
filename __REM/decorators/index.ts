/**
 * The **decorators** module allows to build the database schema out of
 * decorated class.
 *
 * Naming conventions:
 *
 * We don`t want to run into naming conflicts with the model classes, so we
 * prefix all decorators with `Db`.
 */
export * from './column.decorator';
export * from './primary-key.decorator';
export * from './table.decorator';
export * from './unique-key.decorator';
export * from './nullable.decorator';
export * from './default.decorator';
export { getTableMetadata } from './table.metadata';
