import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Hint from '../hint';
import {icon} from '../hint/hint.css';
import {nbsp} from '../value';
import {fullTradingVenue, tradingVenuePlaceholder, tradingVenueToggle} from './transactions.css';

interface Props {
    value: string;
    className?: string;
    fullValueClassName?: string;
}

const {useContext} = React;
const TradingVenue: React.FunctionComponent<Props> = ({value, className = '', fullValueClassName = ''}) => {
    const i18n = useContext(I18nContext);
    const values: string[] = value.split(', ');

    // check if we can combined multiple values which result in a "long" string
    if (value.length > 20 && values.length > 1) {
        return (
            <div className={`${className} ${tradingVenuePlaceholder}`}>
                {/* prevent click by toggle and parent row at the same time */}
                <Hint className={tradingVenueToggle} content={value} onClick={stopEvent}>
                    {localize(i18n, 'trader.productDetails.multipleTradingVenues')}
                    {nbsp}
                    <Icon className={icon} hintIcon={true} />
                </Hint>
            </div>
        );
    }

    return <div className={`${className} ${fullTradingVenue} ${fullValueClassName}`}>{value}</div>;
};

export default React.memo(TradingVenue);
