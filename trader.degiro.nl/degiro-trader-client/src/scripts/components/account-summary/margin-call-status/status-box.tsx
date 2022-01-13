import {MarginCallStatuses, TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Statuses} from '../../../models/status';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import StatusBox from '../../status/status-box';
import getMarginCallStatusI18nOptions from './get-margin-call-status-i18n-options';

interface Props {
    totalPortfolio: Partial<TotalPortfolioData>;
    className?: string;
}

const {useContext} = React;
const MarginCallStatusBox: React.FunctionComponent<Props> = ({className, totalPortfolio}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {marginCallStatus} = totalPortfolio;
    const isMarginCallOpen: boolean = marginCallStatus === MarginCallStatuses.OPEN;
    const isMarginCallPassedDeadline: boolean = marginCallStatus === MarginCallStatuses.IN_LIQUIDATION;

    if (isMarginCallOpen || isMarginCallPassedDeadline) {
        const i18nOptions = getMarginCallStatusI18nOptions(config, currentClient, totalPortfolio);

        return (
            <StatusBox
                className={className}
                title={localize(i18n, `trader.totalPortfolio.marginCall.status.${marginCallStatus}.title`, i18nOptions)}
                body={localize(
                    i18n,
                    `trader.totalPortfolio.marginCall.status.${marginCallStatus}.description`,
                    i18nOptions
                )}
                status={isMarginCallOpen ? Statuses.WARNING : Statuses.ALERT}
            />
        );
    }

    return null;
};

export default React.memo(MarginCallStatusBox);
