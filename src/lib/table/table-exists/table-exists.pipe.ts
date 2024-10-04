import { columnToArray, pickFirstRecord, pipe } from '../../pipe';

export const tableExistsPipe = pipe(
  columnToArray<boolean>('exists'),
  pickFirstRecord<boolean>(),
);
