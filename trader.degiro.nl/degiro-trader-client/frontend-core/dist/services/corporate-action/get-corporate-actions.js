import isValidDate from '../../utils/date/is-valid-date';
import requestToApi from '../api-requester/request-to-api';
export default function getCorporateActions(config) {
    return requestToApi({
        config,
        url: `${config.reportingUrl}v3/ca/${config.intAccount}`
    }).then((actions) => {
        // [WF-1535] Server sends `amount` and `amountInBaseCurr` as strings
        return actions.map((action) => {
            const payDate = action.payDate ? new Date(action.payDate) : undefined;
            return {
                ...action,
                amount: isNaN(action.amount) ? undefined : Number(action.amount),
                amountInBaseCurr: isNaN(action.amountInBaseCurr)
                    ? undefined
                    : Number(action.amountInBaseCurr),
                payDate: isValidDate(payDate) ? payDate : undefined
            };
        });
    });
}
//# sourceMappingURL=get-corporate-actions.js.map