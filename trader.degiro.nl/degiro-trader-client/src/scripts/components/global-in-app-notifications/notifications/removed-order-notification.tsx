import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Snackbar from '../../snackbar';

interface Props {
    onClose(): void;
}

const {useContext} = React;
const RemovedOrderNotification: React.FunctionComponent<Props> = ({onClose}) => {
    const i18n = useContext(I18nContext);

    return <Snackbar onClose={onClose}>{localize(i18n, 'trader.deleteOrder.result.success.title')}</Snackbar>;
};

export default React.memo(RemovedOrderNotification);
