import type { TableConstraint, TableConstraintDiscriminant } from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderConstraintIndexParameters } from './constraint-index-parameters.renderer';

export function renderPrimaryKey(
  primaryKey?: TableConstraint<TableConstraintDiscriminant.PRIMARY_KEY>,
): string {
  if (primaryKey === undefined || primaryKey.args.columns.length === 0) {
    return '';
  }

  const constraintName = renderIdentifier(primaryKey.name);
  const columnNames = renderIdentifier(primaryKey.args.columns);
  const indexParameters = renderConstraintIndexParameters(primaryKey.args);

  return `CONSTRAINT ${constraintName} PRIMARY KEY (${columnNames}) ${indexParameters}`;
}
