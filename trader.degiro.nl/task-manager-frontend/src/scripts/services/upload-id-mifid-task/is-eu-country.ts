import {CountryDocumentsRules} from '../../models/upload-id-mifid-task';

/**
 * @description Return whether country is a part of EU or not
 * @see [WF-1467], [CLM-1425]
 * @param {string} countryId Country's id
 * @param {CountryDocumentsRules} countryDocumentsRules List of EU countries
 * @returns {boolean} True — for EU country, false - otherwise
 */
export default function isEUCountry(countryId: string, countryDocumentsRules: CountryDocumentsRules): boolean {
    return (
        countryId !== 'CH' &&
        countryId !== 'GB' &&
        countryId !== 'OTHER' &&
        countryDocumentsRules[countryId] !== undefined
    );
}
