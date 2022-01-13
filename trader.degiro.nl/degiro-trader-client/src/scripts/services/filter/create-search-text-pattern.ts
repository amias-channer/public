import escapeRegExp from 'frontend-core/dist/utils/reg-exp/escape-reg-exp';

/**
 * @description https://sentry.io/degiro-bv/degiro-trader-frontend/issues/615025646
 * @param {string} searchText
 * @param {string} [flags]
 * @returns {RegExp}
 */
export default function createSearchTextPattern(searchText: string, flags: string = 'i'): RegExp {
    return new RegExp(escapeRegExp(searchText), flags);
}
