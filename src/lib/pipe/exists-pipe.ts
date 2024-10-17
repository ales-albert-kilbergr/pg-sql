import { columnToArray } from './column-to-array.operator';
import { pickFirstRecord } from './pick-nth-record.operator';
import { pipe } from './pipe';

export const existsPipe = pipe(
  columnToArray<boolean>('exists'),
  pickFirstRecord<boolean>(),
);
