import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {ModalAction} from 'frontend-core/dist/components/ui-trader3/modal';
import {AppError} from 'frontend-core/dist/models/app-error';
import isAccountIncompleteError from 'frontend-core/dist/services/app-error/is-account-incomplete-error';
import isLoginFailuresError from 'frontend-core/dist/services/app-error/is-login-failures-error';
import isUsPersonError from 'frontend-core/dist/services/app-error/is-us-person-error';
import getPhoneHref from 'frontend-core/dist/services/contact-info/get-phone-href';
import getPhoneLabel from 'frontend-core/dist/services/contact-info/get-phone-label';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, I18nContext} from '../components/app-component/app-context';
import Icon from '../components/icon';
import prepareRequestError from '../services/request-handler/prepare-request-error';
import shouldResetUserByError from '../services/user/should-reset-user-by-error';

interface Props {
    error: Error | AppError | undefined;
}

const {useEffect, useContext} = React;

export default function useGenericSubmitErrorModal({error}: Props) {
    const i18n = useContext(I18nContext);
    const {openModal, goToUserResetLogin, goToPasswordLogin} = useContext(AppApiContext);

    useEffect(() => {
        if (!error) {
            return;
        }

        const alertIcon: React.ReactElement = <Icon type="exclamation_solid" scale={2} />;
        const closeAction: ModalAction = {
            component: 'button',
            content: localize(i18n, 'modals.closeTitle')
        };

        if (isUsPersonError(error)) {
            openModal({
                icon: alertIcon,
                warning: true,
                content: <InnerHtml>{localize(i18n, 'warnings.clientResidence.usPerson')}</InnerHtml>,
                actions: [closeAction]
            });
            return;
        }

        if (shouldResetUserByError(error)) {
            openModal({
                icon: alertIcon,
                error: true,
                content: <InnerHtml>{localize(i18n, error.text)}</InnerHtml>,
                actions: [
                    {
                        ...closeAction,
                        props: {
                            onClick: goToUserResetLogin
                        }
                    }
                ]
            });
            return;
        }

        if (isAccountIncompleteError(error)) {
            const {text} = prepareRequestError(i18n, error);

            openModal({
                icon: alertIcon,
                error: true,
                content: <InnerHtml>{localize(i18n, text)}</InnerHtml>,
                actions: [
                    {
                        ...closeAction,
                        props: {
                            onClick: goToPasswordLogin
                        }
                    },
                    {
                        component: 'a',
                        props: {
                            href: getPhoneHref(i18n)
                        },
                        content: getPhoneLabel(i18n)
                    }
                ]
            });
            return;
        }

        if (isLoginFailuresError(error)) {
            const {text} = prepareRequestError(i18n, error);

            openModal({
                icon: alertIcon,
                warning: true,
                content: <InnerHtml>{localize(i18n, text)}</InnerHtml>,
                actions: [
                    {
                        ...closeAction,
                        props: {
                            onClick: goToPasswordLogin
                        }
                    }
                ]
            });
        }
    }, [error]);
}
