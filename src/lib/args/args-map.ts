import type { Constructor } from 'type-fest';
import { type Either, left, right } from 'fp-ts/Either';
import { InvalidArgsException } from './invalid-args.exception';
import { validate } from 'class-validator';

export class ArgsMap<ARGS extends object> {
  protected initArgs: Partial<ARGS>;

  protected args: Partial<ARGS>;

  protected readonly argsCtor: Constructor<ARGS>;

  public constructor(
    argsCtor: Constructor<ARGS>,
    initArgs: Partial<ARGS> = {},
  ) {
    this.initArgs = initArgs;
    this.args = Object.assign({}, initArgs);
    this.argsCtor = argsCtor;
  }

  public setArg<K extends keyof ARGS>(key: K, value: ARGS[K]): this {
    this.args[key] = value;

    return this;
  }

  public getArg<K extends keyof ARGS>(key: K): ARGS[K] | undefined {
    return this.args[key];
  }

  public setArgs(args: ARGS): this {
    this.args = args;

    return this;
  }

  public mergeArgs(args: Partial<ARGS>): this {
    this.args = Object.assign(this.args, args);

    return this;
  }

  public getArgs(): Partial<ARGS> {
    return this.args;
  }

  public resetArgs(): this {
    this.args = Object.assign({}, this.initArgs);

    return this;
  }

  public extend<EXT_ARGS extends ARGS>(
    argsCtor: Constructor<EXT_ARGS>,
  ): ArgsMap<EXT_ARGS> {
    return new ArgsMap<EXT_ARGS>(argsCtor, { ...this.args } as EXT_ARGS);
  }

  public clone(): ArgsMap<ARGS> {
    return new ArgsMap<ARGS>(this.argsCtor, { ...this.args });
  }

  public async build(): Promise<Either<InvalidArgsException<ARGS>, ARGS>> {
    const args = Object.assign(new this.argsCtor(), this.args);

    const validationErrors = await validate(args);

    if (validationErrors.length > 0) {
      return left(new InvalidArgsException<ARGS>(this.args, validationErrors));
    }

    return right(args);
  }
}
