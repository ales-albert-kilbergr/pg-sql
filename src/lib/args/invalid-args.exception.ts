import type { ValidationError } from 'class-validator';

export class InvalidArgsException<ARGS extends object> extends Error {
  public readonly args: Partial<ARGS>;

  public validationErrors: ValidationError[];

  public constructor(args: Partial<ARGS>, validationErrors: ValidationError[]) {
    super(`Invalid args: ${JSON.stringify(validationErrors)}`);

    this.args = args;
    this.validationErrors = validationErrors;
  }
}
