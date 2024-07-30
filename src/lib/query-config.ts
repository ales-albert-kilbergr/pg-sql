import type { uuid } from '@kilbergr/tagged-types/uuid';
import type { QueryConfig as QueryConfigInterface } from 'pg';
import { randomUUID } from 'crypto';

export class QueryConfig implements QueryConfigInterface {
  public name?: string;

  public id: uuid = randomUUID() as uuid;

  public text: string;

  public values: unknown[];

  public constructor(text = '', values: unknown[] = []) {
    this.text = text;
    this.values = values;
  }

  public clone(): QueryConfig {
    const clone = new QueryConfig(this.text, [...this.values]);
    clone.name = this.name;

    return clone;
  }
}
