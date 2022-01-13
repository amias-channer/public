import {ModalProps} from 'frontend-core/dist/components/ui-trader3/modal';
import localize from 'frontend-core/dist/services/i18n/localize';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import Icon from '../icon';
import {AppApiContext, I18nContext} from './app-context';

const {useContext, useEffect} = React;
const AddressConfirmation: React.FunctionComponent = () => {
    const appApi = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const location = useLocation();

    useEffect(() => {
        const {addressConfirmation} = parseUrlSearchParams(location.search);
        const actions: ModalProps['actions'] = [
            {
                component: 'a',
                content: localize(i18n, 'taskManager.modals.close')
            }
        ];

        if (addressConfirmation === 'success') {
            appApi.openModal({
                icon: <Icon type="check_regular" scale={2} />,
                content: localize(i18n, 'webtrader.ui.profile-page.contacts.confirmation.success'),
                actions
            });
        } else if (addressConfirmation === 'expired') {
            appApi.openModal({
                error: true,
                icon: <Icon type="exclamation_solid" scale={2} />,
                content: localize(i18n, 'webtrader.ui.profile-page.contacts.confirmation.expired'),
                actions
            });
        }
    }, [location.search]);

    return null;
};

export default React.memo(AddressConfirmation);
