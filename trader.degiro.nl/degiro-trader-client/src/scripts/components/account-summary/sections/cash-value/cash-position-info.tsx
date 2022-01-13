import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {Position} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import hasFlatexBankAccount from 'frontend-core/dist/services/user/has-flatex-bank-account';
import * as React from 'react';
import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import usePositionUpdates, {PositionUpdateField} from '../../../../hooks/use-position-updates';
import {Statuses} from '../../../../models/status';
import isCompensationCappingExceeded from '../../../../services/user/is-compensation-capping-exceeded';
import {CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import StatusIcon from '../../../status/status-icon';
import {
    section as sectionClassName,
    moreInfoButton,
    moreInfoButtonWithRightSeparator,
    sectionLabel
} from '../sections.css';
import {accountSummaryIcon, flexContext} from '../../account-summary.css';
import useOpenCashPositionInfoModal from '../../../app-component/hooks/use-open-cash-position-info-modal';
import {selectableButtonWithBackdrop} from '../../../button/button.css';

type Props = React.PropsWithChildren<{
    totalPortfolio: Partial<TotalPortfolioData>;
    position: Position;
    isColumnContext: boolean;
}>;

const {useContext, memo} = React;
// all fields needed for getCashFundInfoFromPortfolio()
const fields: PositionUpdateField[] = [
    'balanceParticipations',
    'price',
    'totalFundValue',
    'todayResult',
    'totalResult'
];
const CashPositionInfo = memo<Props>(({position, totalPortfolio, children, isColumnContext}) => {
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const hasFlatexCashFunds: boolean = hasFlatexBankAccount(currentClient);
    const showAdditionalInfo = useOpenCashPositionInfoModal(position);

    usePositionUpdates(position, fields);

    return (
        <div className={flexContext}>
            <button type="button" onClick={showAdditionalInfo} className={sectionClassName}>
                {children}
                {isCompensationCappingExceeded(totalPortfolio, currentClient) && (
                    <StatusIcon status={Statuses.WARNING} className={inlineRight} />
                )}
                <span className={sectionLabel}>
                    {hasFlatexCashFunds
                        ? localize(i18n, 'trader.totalPortfolio.flatexCash')
                        : localize(i18n, 'trader.totalPortfolio.cash')}
                </span>
            </button>
            <span className={isColumnContext ? moreInfoButton : moreInfoButtonWithRightSeparator}>
                <button
                    title={
                        hasFlatexCashFunds
                            ? localize(i18n, 'trader.totalPortfolio.flatexCash')
                            : localize(i18n, 'trader.totalPortfolio.cash')
                    }
                    type="button"
                    className={selectableButtonWithBackdrop}
                    onClick={showAdditionalInfo}>
                    <Icon className={accountSummaryIcon} type="info" />
                </button>
            </span>
        </div>
    );
});

CashPositionInfo.displayName = 'CashPositionInfo';
export default CashPositionInfo;
