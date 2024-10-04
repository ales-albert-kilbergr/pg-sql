import type { Class } from 'type-fest';
import { Inject, type ValueProvider } from '@nestjs/common';
import type { Table } from '../model';
import { getTableMetadata } from '../decorators';

export function getTableInjectionToken<T extends object>(
  TableClass: Class<T>,
): string {
  return `table:${TableClass.name}`;
}

export function provideTable<T extends object>(
  TableClass: Class<T>,
): ValueProvider<Table> {
  const metadata = getTableMetadata(TableClass);

  if (!metadata?.table) {
    throw new Error(`Table metadata not found for ${TableClass.name}`);
  }

  return {
    provide: getTableInjectionToken(TableClass),
    useValue: metadata.table,
  };
}

export function InjectTable(TableClass: Class<object>): ParameterDecorator {
  const injectFn = Inject(getTableInjectionToken(TableClass));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    Reflect.apply(injectFn, null, args);
  };
}
