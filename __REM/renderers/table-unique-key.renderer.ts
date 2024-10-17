import type { TableConstraint, TableConstraintDiscriminant } from '../model';
import { renderConstraintIndexParameters } from './constraint-index-parameters.renderer';
import { renderIdentifier } from './identifier.renderer';
import { renderDeferrable } from './keyword-flag.renderer';

export function renderTableUniqueKey(
  constraint?: TableConstraint<TableConstraintDiscriminant.UNIQUE_KEY>,
): string {
  if (!constraint) {
    return '';
  }

  const nullsDistinct = constraint.args.nullsNotDistinct
    ? ' NULLS NOT DISTINCT '
    : '';

  const constraintName = renderIdentifier(constraint.name);
  const columnNames = renderIdentifier(constraint.args.columns);
  const indexParameters = renderConstraintIndexParameters(constraint.args);
  const deferrable = renderDeferrable(constraint.args.deferrable);

  return `CONSTRAINT ${constraintName} 
    UNIQUE ${nullsDistinct} (${columnNames}) ${indexParameters} ${deferrable}`;
}
