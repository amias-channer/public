import {ProductGovernanceSettingsChangeNeededError} from 'frontend-core/dist/models/app-error';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {History} from 'history';
import {AppComponentApi} from '../../../app-component';
import {ModalSizes} from '../../../modal';
import getProductGovernanceSettingsGroupUrl from './get-settings-group-url';
import localizeWarningTitle from './localize-warning-title';

interface Props {
    app: AppComponentApi;
    i18n: I18n;
    error: ProductGovernanceSettingsChangeNeededError;
    history: History;
}

export function showProductGovernanceSettingsWarningModal({
    app,
    i18n,
    history,
    error: {missingProductGovernanceGroups = []}
}: Props) {
    app.openModal({
        title: localizeWarningTitle(i18n, missingProductGovernanceGroups),
        content: localize(i18n, 'trader.productGovernance.orderWarning.description'),
        size: ModalSizes.MEDIUM,
        confirmButtonContent: localize(i18n, 'trader.productGovernance.orderWarning.changeSettings'),
        onConfirm: () => history.push(getProductGovernanceSettingsGroupUrl(missingProductGovernanceGroups))
    });
}
