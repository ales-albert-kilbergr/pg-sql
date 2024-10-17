import type { TableConstraint, TableConstraintDiscriminant } from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderNoInherit } from './keyword-flag.renderer';

export function renderTableCheck(
  constraint?: TableConstraint<TableConstraintDiscriminant.CHECK>,
): string {
  if (!constraint) {
    return '';
  }

  const constraintName = renderIdentifier(constraint.name);
  const noInherit = renderNoInherit(constraint.args.noInherit);

  return `CONSTRAINT ${constraintName} CHECK (${constraint.args.expression}) ${noInherit}`;
}
