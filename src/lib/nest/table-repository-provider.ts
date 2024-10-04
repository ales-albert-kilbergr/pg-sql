import { Inject, type FactoryProvider } from '@nestjs/common';
import type { Class } from 'type-fest';
import { getTableInjectionToken } from './table-metadata-provider';
import type { Table } from '../model';
import { TableRepository } from './table.repository';

export function getTableRepositoryInjectionToken<T extends object>(
  TableClass: Class<T>,
): string {
  return `tableRepository:${TableClass.name}`;
}

export function provideTableRepository<T extends object>(
  TableClass: Class<T>,
): FactoryProvider {
  const tableInjectionToken = getTableInjectionToken(TableClass);

  return {
    provide: getTableRepositoryInjectionToken(TableClass),
    useFactory: (table: Table) => new TableRepository(table),
    inject: [tableInjectionToken],
  };
}

export function InjectTableRepository(
  TableClass: Class<object>,
): ParameterDecorator {
  const injectFn = Inject(getTableRepositoryInjectionToken(TableClass));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    Reflect.apply(injectFn, null, args);
  };
}
