import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppComponentApi} from '../app-component';
import Icon from '../icon';

interface Props {
    i18n: I18n;
    openModal: AppComponentApi['openModal'];
}

export default function showBiometricAuthRequirementsModal({i18n, openModal}: Props) {
    openModal({
        icon: <Icon type="exclamation_solid" scale={2} />,
        content: <InnerHtml>{localize(i18n, 'login.biometricAuth.requirements.description')}</InnerHtml>,
        actions: [
            {
                component: 'button',
                content: localize(i18n, 'modals.closeTitle')
            }
        ]
    });
}
