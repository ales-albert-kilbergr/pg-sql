import type { IUniqueConstraint } from '../../model';
import type { SqlTagParserContext } from '../../parser-context';
import { UniqueConstraint } from '../unique-constraint/unique-constraint';

export function TableUniqueConstraintList(constraints?: IUniqueConstraint[]) {
  if (!constraints || constraints.length === 0) {
    // Noop
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return (): void => {};
  }

  const constraintFns = constraints.map((constraint) =>
    UniqueConstraint(constraint),
  );

  return (ctx: SqlTagParserContext): void => {
    for (const constraintFn of constraintFns) {
      constraintFn(ctx);
      // Add comma after each constraint, except the last one
      if (constraintFns.indexOf(constraintFn) !== constraintFns.length - 1) {
        ctx.addComma();
      }
    }
  };
}
