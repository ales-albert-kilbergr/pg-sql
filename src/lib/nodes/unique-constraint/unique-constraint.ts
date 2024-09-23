import type { IUniqueConstraint } from '../../model';
import type { SqlTagParserContext } from '../../parser-context';

export function UniqueConstraint(uniqueConstraint?: IUniqueConstraint) {
  return (context: SqlTagParserContext): void => {
    if (!uniqueConstraint) {
      return;
    }
    context.addKeyword('CONSTRAINT');
    context.addIdentifier(uniqueConstraint.constraintName);
    context.addKeyword('UNIQUE');
    context.openBracket();
    uniqueConstraint.columns.forEach((column, index) => {
      context.addIdentifier(column);
      if (index < uniqueConstraint.columns.length - 1) {
        context.addComma();
      }
    });
    context.closeBracket();
  };
}
