import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18nContext} from '../../../app-component/app-context';
import {activeFilter, fullLayoutPortfolioFilterButton, labelIcon, portfolioFilterButton} from './filters.css';
import Hint from '../../../hint/index';

interface Props {
    disabled: boolean;
    isActive: boolean;
    field: string;
    onChange(field: string, value: boolean): void;
    className?: string;
    hasGreyBackground?: boolean;
}

const {useContext} = React;
const PortfolioFilter: React.FunctionComponent<Props> = ({isActive, field, disabled, onChange, hasGreyBackground}) => {
    const i18n = useContext(I18nContext);
    const portfolioButton: React.ReactElement = (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(field, !isActive)}
            className={`${portfolioFilterButton} ${hasGreyBackground ? '' : fullLayoutPortfolioFilterButton} ${
                isActive ? activeFilter : ''
            }`}>
            <Icon className={labelIcon} type="account_balance_wallet" />
            {localize(i18n, 'trader.navigation.portfolio')}
        </button>
    );

    return disabled ? (
        <Hint horizontalPosition="inside-start" content={localize(i18n, 'trader.markets.newsFilter.tooltip.portfolio')}>
            {portfolioButton}
        </Hint>
    ) : (
        portfolioButton
    );
};

export default React.memo(PortfolioFilter);
