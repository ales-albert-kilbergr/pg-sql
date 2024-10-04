import type { ArgsMap } from './args-map';

export type WithArgsAccessors<
  ARGS extends object,
  TARGET extends WithArgsMap<ARGS>,
> = TARGET & {
  [K in keyof ARGS]-?: {
    (value: ARGS[K]): WithArgsAccessors<ARGS, TARGET>;
    (): ARGS[K];
  };
};

export interface WithArgsMap<ARGS extends object> {
  args: ArgsMap<ARGS>;
}

export function createArgsAccessor<
  ARGS extends object,
  TARGET extends WithArgsMap<ARGS>,
>(target: TARGET): WithArgsAccessors<ARGS, TARGET> {
  const argsAccessor = new Proxy(target, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(_, prop: string | symbol) {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      return (...args: unknown[]) => {
        if (prop in target) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = Reflect.apply((target as any)[prop], target, args);
          // Keep the proxy chain going
          return result === target ? argsAccessor : result;
        } else {
          if (args.length === 0) {
            return target.args.getArg(prop as keyof ARGS);
          } else {
            target.args.setArg(prop as keyof ARGS, args[0] as ARGS[keyof ARGS]);
            return argsAccessor;
          }
        }
      };
    },
  });

  return argsAccessor as unknown as WithArgsAccessors<ARGS, TARGET>;
}
