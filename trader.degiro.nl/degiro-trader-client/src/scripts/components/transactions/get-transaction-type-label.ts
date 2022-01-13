import {HistoricalTransaction} from 'frontend-core/dist/models/transaction';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18n} from 'frontend-core/dist/models/i18n';

export default function getTransactionTypeLabel(i18n: I18n, transaction: HistoricalTransaction): string | undefined {
    const {transactionTypeId} = transaction;
    const translationTypeIdKey: string | undefined =
        transactionTypeId === undefined ? undefined : `transaction.type.${transactionTypeId}`;

    if (!translationTypeIdKey || !hasTranslation(i18n, translationTypeIdKey)) {
        return undefined;
    }

    return localize(i18n, translationTypeIdKey);
}
