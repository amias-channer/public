import {User} from 'frontend-core/dist/models/user';
import {TotalPortfolioCostType, TotalPortfolioCostTypeField} from 'frontend-core/dist/services/total-portfolio';
import getTotalPortfolioCostTypes from 'frontend-core/dist/services/total-portfolio/get-total-portfolio-cost-types';

export default function getTotalPortfolioCostTypeFields(
    client: User
): {
    fields: TotalPortfolioCostTypeField[];
    defaultField: TotalPortfolioCostTypeField;
} {
    const fields: TotalPortfolioCostTypeField[] = getTotalPortfolioCostTypes(client).map(
        (costType: TotalPortfolioCostType) => costType.id
    );

    return {
        fields,

        // [WF-2507] set first cost type field or "avail. to spend" as a fallback
        defaultField: fields[0] || 'availableToSpend'
    };
}
