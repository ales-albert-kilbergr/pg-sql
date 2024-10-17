import {
  ReferentialActionDiscriminant,
  type ReferentialAction,
} from '../model';
import { renderIdentifier } from './identifier.renderer';
import { renderKeyword } from './keyword.renderer';

export function renderReferentialAction<
  D extends ReferentialActionDiscriminant,
>(action?: ReferentialAction<D>): string {
  if (!action) {
    return '';
  }

  if (action.type === ReferentialActionDiscriminant.NO_ACTION) {
    return renderKeyword('NO ACTION');
  }

  if (action.type === ReferentialActionDiscriminant.CASCADE) {
    return renderKeyword('CASCADE');
  }

  if (action.type === ReferentialActionDiscriminant.RESTRICT) {
    return renderKeyword('RESTRICT');
  }

  if (action.type === ReferentialActionDiscriminant.SET_NULL) {
    const columnNames = renderIdentifier(action.columns);
    return ` SET NULL (${columnNames}) `;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (action.type === ReferentialActionDiscriminant.SET_DEFAULT) {
    const columnNames = renderIdentifier(action.columns);
    return ` SET DEFAULT (${columnNames}) `;
  }

  return '';
}
