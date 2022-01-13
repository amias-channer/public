import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {PriceAlert} from '../../models/price-alert';
import Hint from '../hint/index';

interface Props {
    i18n: I18n;
    priceAlert: PriceAlert;
    className?: string;
}

const LastAlertsStatusTooltip: React.FunctionComponent<Props> = ({i18n, className, priceAlert: {fireCountLeft}}) => {
    const shouldShowNoAlertsHint: boolean = fireCountLeft === 0;
    const shouldShowLastAlertHint: boolean = fireCountLeft === 1;

    if (shouldShowNoAlertsHint || shouldShowLastAlertHint) {
        return (
            <Hint
                className={className}
                content={localize(
                    i18n,
                    shouldShowLastAlertHint
                        ? 'regulatoryPriceAlert.mail.conditionalNext90.explanation'
                        : 'regulatoryPriceAlert.mail.conditionalValue0.explanation'
                )}>
                <Icon hintIcon={true} />
            </Hint>
        );
    }

    return null;
};

export default React.memo(LastAlertsStatusTooltip);
