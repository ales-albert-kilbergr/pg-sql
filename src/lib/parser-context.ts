import { escapeIdentifier } from 'pg';
import { formatSqlText } from './helpers';
import { Literal, Value } from './nodes';
import { QueryConfig } from './query-config';
import type { SqlTemplateNode } from './sql.types';
import type { SqlKeyword } from './sql-keyword';

const VALUE_BINDING_REG_EXP = /(\.\.\.)?:$/;
const INLINE_VALUE_BINDING_REG_EXP = /(\.\.\.)?:L$/;

export class SqlTagParserContext {
  public static BINDING_MATCHER_REG_EXP = /\$(\d+)/gm;

  public static readonly DEFAULT_INIT_BINDING_INDEX = 0;

  public values: unknown[] = [];

  public fragments: string[] = [];

  public readonly initBindingIndex: number;

  public constructor(
    fragments: string[] = [],
    values: unknown[] = [],
    initBindingIndex = SqlTagParserContext.DEFAULT_INIT_BINDING_INDEX,
  ) {
    this.fragments = fragments;
    this.values = values;
    this.initBindingIndex = initBindingIndex;
  }

  public static Empty(): SqlTagParserContext {
    return new SqlTagParserContext();
  }

  public static from(strings: string[], nodes: unknown[]): SqlTagParserContext {
    const context = new SqlTagParserContext([strings[0]]);

    for (let index = 1; index < strings.length; index++) {
      const node = nodes[index - 1];

      context.parseNode(node);

      if (strings[index]) {
        context.addFragment(strings[index]);
      }
    }

    return context;
  }

  public pipe(...fns: ((context: this) => void)[]): this {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < fns.length; index++) {
      if (index > 0) {
        this.addFragment(' ');
      }
      fns[index](this);
    }

    return this;
  }

  public spawnChild(): SqlTagParserContext {
    return new SqlTagParserContext(
      [],
      [],
      this.initBindingIndex + this.values.length,
    );
  }

  public appendChild(context: SqlTagParserContext): this {
    this.fragments.push(...context.fragments);
    this.values.push(...context.values);

    return this;
  }

  public parseNode(node: unknown): void {
    const lastFragment = this.getLastFragment();

    // Check if the node is a function. If yes, we will expect it to be a custom
    // parser function and will give to it the fragments and values to fill it.
    if (typeof node === 'function') {
      node(this);
    }
    // Check if the node is an instance of SqlTemplateNode. If yes, we will parse
    // let it to parse the fragments and values on its own.
    else if (this.implementsSqlTemplateNode(node)) {
      node.parse(this);
    }
    // If the last fragment is not a binding placeholder then we have to check
    // what kind of node we have and choose an appropriate parsing strategy.
    // The first case check if the node is also a QueryConfig instance. In such
    // we will read text and values from the node and append them to the list of
    // text fragments and values.
    else if (node instanceof QueryConfig) {
      this.mergeQueryConfig(node);
    }
    // We check if the last fragment is a binding placeholder. In such case we
    // will consider the node to be a value. That value has to be stored in the
    // list of values and replaced by the binding placeholder with correct index.
    else if (VALUE_BINDING_REG_EXP.test(lastFragment)) {
      // Parse the node as a value binding.
      // Tests syntax like SET account.tags = :[]${myVar}
      // In this case values are not meant to be splitted into sequence $1, $2,...
      // but to be treated as an array input for a single field.
      const isArrayValueType = lastFragment.endsWith('...:');
      this.replaceLastFragment(lastFragment.replace(VALUE_BINDING_REG_EXP, ''));
      Value(node, { spreadValues: isArrayValueType })(this);
    }
    // Treat cases when we want to use an inline binding but the pg does not
    // support it. That could be for example the case FROM TO clause.
    // We have to do the value escaping on our own.
    else if (INLINE_VALUE_BINDING_REG_EXP.test(lastFragment)) {
      const isArrayValueType = lastFragment.endsWith('...:L');
      this.replaceLastFragment(
        lastFragment.replace(INLINE_VALUE_BINDING_REG_EXP, ''),
      );
      Literal(node, { spreadValues: isArrayValueType })(this);
    } else if (typeof node === 'string') {
      this.addFragment(node);
    } else {
      this.addFragment(String(node));
    }
  }

  public addIdentifier(identifier: string): this {
    this.addFragment(
      identifier
        .split('.')
        .map((part) => escapeIdentifier(part))
        .join('.'),
    );

    return this;
  }

  public addKeyword(keyword: SqlKeyword): this {
    this.addFragment(` ${keyword.toUpperCase()} `);

    return this;
  }

  public addFragment(...fragments: string[]): this {
    this.fragments.push(...fragments);

    return this;
  }

  public closeBracket(): this {
    this.addFragment(')');

    return this;
  }

  public openBracket(): this {
    this.addFragment('(');

    return this;
  }

  public addValue(...values: unknown[]): this {
    for (const value of values) {
      this.fragments.push(this.getNextValueIndex());
      this.values.push(value);
    }

    return this;
  }

  public bindValue(value: unknown, isArrayValueType = false): this {
    // A binding string is "$1, $2, $3, ...".
    const bindings: string[] = [];
    // A parsed node is an array but is should be kept as one bind value only.
    if (isArrayValueType) {
      const valueArr = Array.isArray(value) ? value : [value];

      valueArr.forEach((n) => {
        if (n === undefined) {
          bindings.push('DEFAULT');
        } else if (n === null) {
          bindings.push('NULL');
        } else {
          // Stores the binding placeholder for the value with it`s position
          // index.
          bindings.push(this.getNextValueIndex());
          // Spread the array values into the list of values.
          this.values.push(this.serializeValue(n));
        }
      });
    } else {
      // Otherwise we want to use the node as a single value.
      if (value === undefined) {
        this.addFragment('DEFAULT');
      } else if (value === null) {
        this.addFragment('NULL');
      } else {
        bindings.push(this.getNextValueIndex());
        this.values.push(this.serializeValue(value));
      }
    }

    if (bindings.length > 0) {
      this.addFragment(bindings.join(', '));
    }

    return this;
  }

  public mergeQueryConfig(queryConfig: QueryConfig): this {
    const updatedText = queryConfig.text.replace(
      SqlTagParserContext.BINDING_MATCHER_REG_EXP,
      (_, ix) =>
        '$' + (Number(ix) + this.values.length + this.initBindingIndex),
    );
    this.addFragment(updatedText);

    this.values.push(...queryConfig.values);

    return this;
  }

  public getLastFragment(): string {
    return this.fragments[this.fragments.length - 1];
  }

  public replaceLastFragment(fragment: string): this {
    this.fragments[this.fragments.length - 1] = fragment;

    return this;
  }

  public getNextValueIndex(): string {
    return `$${this.initBindingIndex + this.values.length + 1}`;
  }

  public toSqlText(): string {
    return formatSqlText(
      this.fragments.join(''),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );
  }

  public toQueryConfig(): QueryConfig {
    return new QueryConfig(this.toSqlText(), this.values);
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  private implementsSqlTemplateNode(node: unknown): node is SqlTemplateNode {
    return (
      typeof node === 'object' &&
      node !== null &&
      typeof Reflect.get(node, 'parse') === 'function'
    );
  }

  private serializeValue(value: unknown): unknown {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.serializeValue(v));
    }
    return value;
  }
}
