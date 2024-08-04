import { QueryConfig } from "../lib/query-config";

export function QueryConfigStub(
  overrides: Partial<QueryConfig> = {}
): QueryConfig {
  const text = overrides.text ?? 'SELECT NOW()';
  const values = overrides.values ?? [];

  return new QueryConfig(text, values);
}