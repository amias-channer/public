import {CorporateAction} from 'frontend-core/dist/models/corporate-action';

/**
 * @description `ca_id` is not unique
 * @param {CorporateAction} corporateAction
 * @returns {string}
 */
export default function getCorporateActionId(corporateAction: CorporateAction): string {
    return corporateAction.ca_id + corporateAction.description + corporateAction.product + corporateAction.amount;
}
