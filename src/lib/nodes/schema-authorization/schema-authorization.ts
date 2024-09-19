import type { SqlTagParserContext } from '../../parser-context';

export type SchemaAuthorizationType =
  | 'CURRENT_USER'
  | 'CURRENT_ROLE'
  | 'SESSION_USER'
  | string;

export function SchemaAuthorization(
  schemaAuthorization: SchemaAuthorizationType | undefined | null,
) {
  return (context: SqlTagParserContext): void => {
    if (schemaAuthorization === 'CURRENT_USER') {
      context.addKeyword('AUTHORIZATION').addFragment('CURRENT_USER');
    } else if (schemaAuthorization === 'CURRENT_ROLE') {
      context.addKeyword('AUTHORIZATION').addFragment('CURRENT_ROLE');
    } else if (schemaAuthorization === 'SESSION_USER') {
      context.addKeyword('AUTHORIZATION').addFragment('SESSION_USER');
    } else if (
      typeof schemaAuthorization === 'string' &&
      schemaAuthorization &&
      !/\s+/.test(schemaAuthorization)
    ) {
      context.addKeyword('AUTHORIZATION').addIdentifier(schemaAuthorization);
    }
  };
}
