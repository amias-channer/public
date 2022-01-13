import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {I18n} from 'frontend-core/dist/models/i18n';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';
import {IexParams, IexStatuses} from '../../models/iex';
import {User} from '../../models/user';
import connectIex from '../../services/iex/connect-iex';
import generateIexReturnUrlParams from '../../services/iex/generate-iex-return-url-params';
import redirectToIexReturnUrl from '../../services/iex/redirect-to-iex-return-url';
import {AppComponentApi} from '../app-component';
import Icon from '../icon/index';

export interface IexConfirmationProps {
    i18n: I18n;
    config: Config;
    appParams: AppParams;
    user: User;
    openModal: AppComponentApi['openModal'];
    showAppLoader(): void;
    hideAppLoader(): void;
}

function submitIexConfirmationStatus(props: IexConfirmationProps, iexStatus: IexStatuses) {
    const {config, user} = props;
    const iexParams = props.appParams as IexParams;

    props.showAppLoader();

    generateIexReturnUrlParams(config, user, {
        iexId: iexParams.iexId,
        iexAction: iexParams.iexAction,
        iexStatus
    })
        .then((iexReturnUrlParams) => redirectToIexReturnUrl(iexStatus, iexParams, iexReturnUrlParams))
        .catch(() => {
            props.hideAppLoader();
            // try again
            showIexConfirmationModal(props);
        });
}

function submitIexConfirmation(props: IexConfirmationProps) {
    const {config, user} = props;
    const iexParams: IexParams = props.appParams as IexParams;

    props.showAppLoader();

    connectIex(config, user, {
        iexId: iexParams.iexId,
        iexAction: iexParams.iexAction,
        iexTimestamp: iexParams.iexTimestamp,
        iexCode: iexParams.iexCode
    })
        .then((iexStatus: IexStatuses) => submitIexConfirmationStatus(props, iexStatus))
        .catch(() => {
            props.hideAppLoader();
            // try again
            showIexConfirmationModal(props);
        });
}

export function showIexConfirmationModal(props: IexConfirmationProps) {
    const {i18n} = props;
    const iexParams = props.appParams as IexParams;

    props.openModal({
        icon: <Icon type="question_solid" scale={2} />,
        title: localize(i18n, 'login.iex.confirmationTitle'),
        content: <InnerHtml>{localize(i18n, `login.iex.${iexParams.iexAction}.confirmationDescription`)}</InnerHtml>,
        actions: [
            {
                component: 'button',
                props: {
                    type: 'button',
                    onClick: submitIexConfirmationStatus.bind(null, props, IexStatuses.CANCEL)
                },
                closeModal: true,
                content: localize(i18n, 'modals.cancelTitle')
            },
            {
                component: 'button',
                props: {
                    type: 'button',
                    onClick: submitIexConfirmation.bind(null, props)
                },
                closeModal: true,
                content: localize(i18n, 'modals.confirmTitle')
            }
        ]
    });

    trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/iex-confirmation'});
}
