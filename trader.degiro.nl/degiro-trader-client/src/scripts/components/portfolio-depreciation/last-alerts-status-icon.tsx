import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import * as React from 'react';
import {PriceAlert} from '../../models/price-alert';
import {infoStatusText, warningStatusText} from '../status/status.css';

interface Props {
    priceAlert: PriceAlert;
}

const LastAlertsStatusIcon: React.FunctionComponent<Props> = ({priceAlert}) => {
    const {fireCountLeft} = priceAlert;
    const shouldShowNoAlertsHint: boolean = fireCountLeft === 0;
    const shouldShowLastAlertHint: boolean = fireCountLeft === 1;

    if (shouldShowNoAlertsHint || shouldShowLastAlertHint) {
        return <Icon type="bullet" className={shouldShowLastAlertHint ? infoStatusText : warningStatusText} />;
    }

    return null;
};

export default React.memo(LastAlertsStatusIcon);
