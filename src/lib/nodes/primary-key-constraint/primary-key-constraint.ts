import type { PrimaryKey } from '../../model';
import type { SqlTagParserContext } from '../../parser-context';

export function PrimaryKeyConstraint(args?: PrimaryKey) {
  return (ctx: SqlTagParserContext): void => {
    if (!args) {
      return;
    }
    const primaryKeyName = args.constraintName ?? `pk_${args.table}`;
    ctx.addKeyword('CONSTRAINT');
    ctx.addIdentifier(primaryKeyName);
    ctx.addKeyword('PRIMARY KEY');
    ctx.openBracket();
    args.columns.forEach((column, index) => {
      ctx.addIdentifier(column);
      if (index < args.columns.length - 1) {
        ctx.addComma();
      }
    });
    ctx.closeBracket();
  };
}
