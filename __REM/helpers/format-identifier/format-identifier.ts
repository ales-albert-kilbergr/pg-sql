import { escapeIdentifier } from 'pg';
import type { SetRequired } from 'type-fest';

export interface FormatIdentifierOptions {
  /**
   * Convert the table name from camelCase to sneak_case
   */
  toSneakCase?: boolean;
  /**
   * Convert the table name to lower case
   */
  toLowerCase?: boolean;
  /**
   * Wrap the identifier in quotes
   */
  useQuotes?: boolean;
  /**
   * If the name to be converted is an object, use the the template to format
   * the name and to apply all formatting options to it's properties.
   */
  useTemplate?: string;
}

export const FORMAT_IDENTIFIER_DEFAULT_OPTIONS: FormatIdentifierOptions = {
  useQuotes: true,
  toLowerCase: true,
  toSneakCase: true,
};

function formatIdentifierFragment(
  fragment: string,
  options: Pick<FormatIdentifierOptions, 'useQuotes'>,
): string {
  if (options.useQuotes === true) {
    return escapeIdentifier(fragment);
  }
  return fragment;
}

function formatIdentifierTemplate(
  tplVars: object,
  options: FormatIdentifierOptions,
): string {
  if (options.useTemplate === undefined) {
    throw new Error('useTemplate option is required when name is an object');
  }

  let identifier = options.useTemplate;
  // Apply values to the table name template
  for (const [key, value] of Object.entries(tplVars)) {
    identifier = identifier.replace(
      `{${key}}`,
      options.useQuotes === true
        ? escapeIdentifier(value as string)
        : (value as string),
    );
  }
  // Remove any remaining template values
  identifier = identifier.replace(/\{[a-zA-Z0-9_]+\}/g, '');
  // Remove trailing dots from the beginning and end of the string
  identifier = identifier.replace(/(^\.+|\.+$)/g, '');

  return identifier;
}

export function formatIdentifier(
  name: string | string[],
  options?: Omit<FormatIdentifierOptions, 'useTemplate'>,
): string;
export function formatIdentifier(
  name: object,
  options: SetRequired<FormatIdentifierOptions, 'useTemplate'>,
): string;
export function formatIdentifier(
  arg1: string | string[] | object,
  options: FormatIdentifierOptions = FORMAT_IDENTIFIER_DEFAULT_OPTIONS,
): string {
  let identifier =
    typeof arg1 === 'string'
      ? /\./.test(arg1)
        ? arg1
            .split('.')
            .map((fragment) => formatIdentifierFragment(fragment, options))
            .join('.')
        : formatIdentifierFragment(arg1, options)
      : Array.isArray(arg1)
        ? arg1
            .map((fragment) => formatIdentifierFragment(fragment, options))
            .join('.')
        : formatIdentifierTemplate(arg1, options);

  if (options.toSneakCase === true) {
    identifier = identifier.replace(/([a-z])([A-Z])/g, '$1_$2');
  }

  if (options.toLowerCase === true) {
    identifier = identifier.toLowerCase();
  }

  return identifier;
}
