import { DatabaseError } from 'pg';

export type ErrorHandler<ERROR> = (error: any) => ERROR;

export type ErrorMatcher<ERROR> = (
  error: any,
) => ERROR | undefined | false | null;

export function matchError<A>(fn1: ErrorMatcher<A>): ErrorHandler<A>;
export function matchError<A, B>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
): ErrorHandler<A | B>;
export function matchError<A, B, C>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
): ErrorHandler<A | B | C>;
export function matchError<A, B, C, D>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
): ErrorHandler<A | B | C | D>;
export function matchError<A, B, C, D, E>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
): ErrorHandler<A | B | C | D | E>;
export function matchError<A, B, C, D, E, F>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
  fn6: ErrorMatcher<F>,
): ErrorHandler<A | B | C | D | E | F>;
export function matchError<A, B, C, D, E, F, G>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
  fn6: ErrorMatcher<F>,
  fn7: ErrorMatcher<G>,
): ErrorHandler<A | B | C | D | E | F | G>;
export function matchError<A, B, C, D, E, F, G, H>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
  fn6: ErrorMatcher<F>,
  fn7: ErrorMatcher<G>,
  fn8: ErrorMatcher<H>,
): ErrorHandler<A | B | C | D | E | F | G | H>;
export function matchError<A, B, C, D, E, F, G, H, I>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
  fn6: ErrorMatcher<F>,
  fn7: ErrorMatcher<G>,
  fn8: ErrorMatcher<H>,
  fn9: ErrorMatcher<I>,
): ErrorHandler<A | B | C | D | E | F | G | H | I>;
export function matchError<A, B, C, D, E, F, G, H, I, J>(
  fn1: ErrorMatcher<A>,
  fn2: ErrorMatcher<B>,
  fn3: ErrorMatcher<C>,
  fn4: ErrorMatcher<D>,
  fn5: ErrorMatcher<E>,
  fn6: ErrorMatcher<F>,
  fn7: ErrorMatcher<G>,
  fn8: ErrorMatcher<H>,
  fn9: ErrorMatcher<I>,
  fn10: ErrorMatcher<J>,
): ErrorHandler<A | B | C | D | E | F | G | H | I | J>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function matchError(...fns: ErrorMatcher<any>[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (error: unknown): ErrorHandler<any> => {
    for (const fn of fns) {
      const result = fn(error);
      if (result !== undefined && result !== false && result !== null) {
        return result;
      }
    }
    throw error;
  };
}

export function matchDatabaseError<ERROR>(
  code: string,
  handler: (error: DatabaseError) => ERROR | false | null,
): (error: unknown) => ERROR | false | null {
  return (error: unknown): false | ERROR | null => {
    if (error instanceof DatabaseError && (!code || error.code === code)) {
      return handler(error);
    }
    return false;
  };
}

export function matchDuplicateTableError<ERROR>(
  handler: (
    ctx: { table: string },
    error: DatabaseError,
  ) => ERROR | false | null,
): (error: DatabaseError) => ERROR | false | null {
  return matchDatabaseError<ERROR>('42P07', (error: DatabaseError) => {
    const match = /relation "(?<table>.*?)" already exists/.exec(error.message);
    const table = match?.groups?.table ?? '';

    if (!table) {
      return false;
    }

    return handler({ table }, error);
  });
}

export function matchUndefinedTableError<ERROR>(
  handler: (
    ctx: { table: string },
    error: DatabaseError,
  ) => ERROR | false | null,
): (error: DatabaseError) => ERROR | false | null {
  return matchDatabaseError<ERROR>('42P01', (error: DatabaseError) => {
    const match = /relation "(?<table>.*?)" does not exist/.exec(error.message);
    const table = match?.groups?.table ?? '';

    if (!table) {
      return false;
    }

    return handler({ table }, error);
  });
}

function isConstraintViolationError(
  error: DatabaseError,
  constraint: string | RegExp,
): boolean {
  const match = /constraint "(?<constraint>.*?)"/.exec(error.message);
  const constraintName = match?.groups?.constraint ?? '';

  if (constraint instanceof RegExp) {
    return constraint.test(constraintName);
  }

  return constraintName === constraint;
}

function extractConflictingColumns(error: DatabaseError): object | false {
  const errorDetail = error.detail ?? '';
  // We want to parse a map object where key is the conflicting
  // column and value is the conflicting value from the error detail.
  // Example of an error detail can be:
  //   Key (id)=(event_store_id_5PseERABKl) already exists.

  if (!errorDetail.startsWith('Key')) {
    return false;
  }

  const match = /Key \((?<keys>.*?)\)=\((?<values>.*?)\)/.exec(errorDetail);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conflict: any = {};

  if (match?.groups) {
    const { keys, values } = match.groups;

    const keysArray = keys.split(',').map((key) => key.trim());
    const valuesArray = values.split(',').map((value) => value.trim());

    for (let i = 0; i < keysArray.length; i++) {
      conflict[keysArray[i]] = valuesArray[i];
    }
  }

  return conflict;
}

export function matchUniqueConstraintViolationError<C extends object, ERROR>(
  constraint: string | RegExp,
  handler: (conflict: C, error: DatabaseError) => ERROR,
): (error: DatabaseError) => ERROR | false | null {
  return matchDatabaseError<ERROR>('23505', (error: DatabaseError) => {
    if (isConstraintViolationError(error, constraint)) {
      const conflict = extractConflictingColumns(error);

      if (!conflict) {
        return false;
      }

      return handler(conflict as C, error);
    }
    return false;
  });
}

export function matchForeignKeyConstraintViolation<C extends object, ERROR>(
  constraint: string | RegExp,
  handler: (conflict: C, error: DatabaseError) => ERROR,
): (error: DatabaseError) => ERROR | false | null {
  return matchDatabaseError<ERROR>('23503', (error: DatabaseError) => {
    if (isConstraintViolationError(error, constraint)) {
      const conflict = extractConflictingColumns(error);

      if (!conflict) {
        return false;
      }

      return handler(conflict as C, error);
    }
    return false;
  });
}
