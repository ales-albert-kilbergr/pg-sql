import type { ConstraintIndexParameters } from '../model';
import { renderIdentifier } from './identifier.renderer';

export function renderConstraintIndexParameters(
  params?: ConstraintIndexParameters,
): string {
  if (params === undefined) {
    return '';
  }

  const include = params.include
    ? ` INCLUDE (${renderIdentifier(params.include)})`
    : '';

  const _with =
    params.with && params.with.length > 0
      ? ` WITH (${params.with.join(', ')})`
      : '';

  const usingIndexTablespace = params.usingIndexTablespace
    ? ` USING INDEX TABLESPACE ${renderIdentifier(params.usingIndexTablespace)}`
    : '';

  return `${include} ${_with} ${usingIndexTablespace}`;
}
