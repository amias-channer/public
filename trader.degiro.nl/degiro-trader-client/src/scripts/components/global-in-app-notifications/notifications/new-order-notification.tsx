import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Statuses} from '../../../models/status';
import {I18nContext} from '../../app-component/app-context';
import Snackbar from '../../snackbar';
import {action, gap} from '../../snackbar/snackbar.css';
import StatusIcon from '../../status/status-icon';

interface Props {
    onClose(): void;
}

const {useContext} = React;
const NewOrderNotification: React.FunctionComponent<Props> = ({onClose}) => {
    const i18n = useContext(I18nContext);

    return (
        <Snackbar onClose={onClose}>
            <StatusIcon status={Statuses.SUCCESS} className={inlineLeft} />
            {localize(i18n, 'trader.createOrder.result.success.title')}
            <div className={gap} />
            <Link to={Routes.OPEN_ORDERS} className={action}>
                {localize(i18n, 'trader.notifications.actions.view')}
            </Link>
        </Snackbar>
    );
};

export default React.memo(NewOrderNotification);
