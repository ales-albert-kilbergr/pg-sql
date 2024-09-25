import type { TableConstraint, TableConstraintDiscriminant } from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderReferentialAction } from './referential-action.renderer';

export function renderTableForeignKey(
  constraint?: TableConstraint<TableConstraintDiscriminant.FOREIGN_KEY>,
): string {
  if (!constraint) {
    return '';
  }

  const constraintName = renderIdentifier(constraint.name);
  const columnNames = renderIdentifier(constraint.args.columns);
  const refTable = renderIdentifier(constraint.args.refTable);
  const refColumnNames = renderIdentifier(constraint.args.refColumns);

  const onDelete = constraint.args.onDelete
    ? ` ON DELETE ${renderReferentialAction(constraint.args.onDelete)}`
    : '';

  const onUpdate = constraint.args.onUpdate
    ? ` ON UPDATE ${renderReferentialAction(constraint.args.onUpdate)}`
    : '';

  const matchType = constraint.args.matchType
    ? ` MATCH ${constraint.args.matchType}`
    : '';

  return `
    CONSTRAINT ${constraintName} FOREIGN KEY (${columnNames}) 
      REFERENCES ${refTable} (${refColumnNames})
      ${onDelete} ${onUpdate} ${matchType}
  `;
}
