/**
 * Remove a comment. The comment can be starting at new line or in the middle.
 * The comment may or may not have an EOL character at the end. If yes, we
 * want to remove it if the comment takes the whole line but keep it if the
 * comment is in the middle of the line.
 */
const REMOVE_WHOLE_LINE_COMMENTS_REGEXP = /^--.*\n/gm;
const REMOVE_MIDLINE_COMMENTS_REGEXP = /--.*/gm;
const REMOVE_EOL_REGEXP = /(?:\r\n|\r|\n)/gm;
const REMOVE_MULTI_SPACES_REGEXP = /(?:(?!\n)\s)+/gm;
/**
 * Remove trailing space after opening characters (e.g. "( SELECT " -> "(SELECT")
 */
const REMOVE_TRAILING_SPACES_REGEXP = /([\(])\s/gm;
/**
 * Remove leading space before closing characters (e.g. " ;" -> ";")
 */
const REMOVE_LEADING_SPACES_REGEXP = /\s([\;\)])/gm;

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace formatSqlText {
  export interface Options {
    /**
     * Remove all comments from the SQL text.
     */
    removeComments?: boolean;
    /**
     * Remove all EOL characters from the SQL text.
     */
    removeEOL?: boolean;
    /**
     * Remove all occurrences of more than one space character.
     */
    removeMultiSpaces?: boolean;
    /**
     * Remove trailing space after opening characters (e.g. "( SELECT " -> "(SELECT").
     * Remove leading space before closing characters (e.g. " ;" -> ";").
     */
    removeTrailingSpaces?: boolean;
  }
}

export function formatSqlText(
  text: string,
  options?: formatSqlText.Options,
): string {
  let formattedText = text;

  if (options?.removeComments === true) {
    formattedText = formattedText
      .replace(REMOVE_WHOLE_LINE_COMMENTS_REGEXP, '')
      .replace(REMOVE_MIDLINE_COMMENTS_REGEXP, '');
  }

  if (options?.removeEOL === true) {
    formattedText = formattedText.replace(REMOVE_EOL_REGEXP, '');
  }

  if (options?.removeMultiSpaces === true) {
    formattedText = formattedText.replace(REMOVE_MULTI_SPACES_REGEXP, ' ');
  }

  if (options?.removeTrailingSpaces === true) {
    formattedText = formattedText
      .replace(REMOVE_TRAILING_SPACES_REGEXP, '$1')
      .replace(REMOVE_LEADING_SPACES_REGEXP, '$1')
      .trim();
  }

  return formattedText;
}

formatSqlText.REMOVE_ALL_OPTIONS = {
  removeComments: true,
  removeEOL: true,
  removeMultiSpaces: true,
  removeTrailingSpaces: true,
} as formatSqlText.Options;
