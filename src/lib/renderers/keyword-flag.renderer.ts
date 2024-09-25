import { renderKeyword } from './keyword.renderer';

function renderKeywordFlag(keyword: string) {
  return (useFlag: boolean | undefined): string =>
    useFlag === true ? renderKeyword(keyword) : '';
}

export const renderIfNotExists = renderKeywordFlag('IF NOT EXISTS');

export const renderIfExists = renderKeywordFlag('IF EXISTS');

export const renderDeferrable = renderKeywordFlag('DEFERRABLE');

export const renderNoInherit = renderKeywordFlag('NO INHERIT');
