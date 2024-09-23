/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/ban-types */
import { Metadata } from '@kilbergr/metadata';

const entityMetadata = new Metadata<{
  schema: string;
  table: string;
}>('pg:entity');

export function Entity(name: string): ClassDecorator {
  const nameParts = name.split('.');
  const schema = nameParts.length === 2 ? nameParts[0] : 'public';
  const table = nameParts.length === 2 ? nameParts[1] : name;

  return function (target: Function): void {
    entityMetadata.set(target, { schema, table });
  };
}

Entity.metadata = entityMetadata;
