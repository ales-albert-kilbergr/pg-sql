import type { SqlTagParserContext } from '../../parser-context';

export interface PrimaryKeyArgs {
  columns?: string[];
  table: string;
  constraintName?: string;
}

export function PrimaryKey(args?: PrimaryKeyArgs) {
  return (ctx: SqlTagParserContext): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!args || !args.columns || args.columns.length === 0) {
      return;
    }

    const primaryKeyName = args.constraintName ?? `pk_${args.table}`;
    ctx.addKeyword('CONSTRAINT');
    ctx.addIdentifier(primaryKeyName);
    ctx.addKeyword('PRIMARY KEY');
    ctx.openBracket();
    const columnsCount = args.columns.length;
    args.columns.forEach((column, index) => {
      ctx.addIdentifier(column);
      if (index < columnsCount - 1) {
        ctx.addComma();
      }
    });
    ctx.closeBracket();
  };
}
