import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import {CashFundCompensation} from '../../../models/portfolio';
import useDataTableFullLayoutFlag from '../../data-table/hooks/use-data-table-full-layout-flag';
import CashFundCompensationsCompactView from './cash-fund-compensations-compact-view';
import CashFundCompensationsFullView from './cash-fund-compensations-full-view';
import getCashFundCompensationItems from './get-cash-fund-compensation-items';
import PayoutButton from './payout-button';
import {CurrentClientContext, I18nContext} from '../../app-component/app-context';
import CardHeader from '../../card/header';
import Hint from '../../hint';
import Card from '../../card';
import {nonEmptyPositionsSection, positionsSection} from '../portfolio.css';

export interface CashFundCompensationsViewProps {
    tableItems: CashFundCompensation[];
    getPayoutControl(item: CashFundCompensation): React.ReactNode;
}

const {useState, useEffect, useCallback, useContext} = React;
const CashFundCompensations: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const [compensations, setCompensations] = useState<CashFundCompensation[]>([]);
    const {totalPortfolio} = useTotalPortfolio();
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    // [WF-2127]: do not show compensations table (therefore do not request data) for Pension accounts
    const canShowCompensations: boolean = !currentClient.isCustodyPensionClient;
    const getPayoutControl = useCallback(
        ({id, amount = 0}: CashFundCompensation): React.ReactNode => {
            return id === 'accrued' && amount >= 1 ? <PayoutButton /> : null;
        },
        [i18n]
    );

    useEffect(() => {
        if (!canShowCompensations) {
            return setCompensations([]);
        }

        setCompensations(getCashFundCompensationItems(totalPortfolio, currentClient));
    }, [canShowCompensations, totalPortfolio, currentClient]);

    if (!compensations.length) {
        return null;
    }

    return (
        <div
            aria-live="polite"
            data-name="positions"
            data-empty="false"
            className={`${positionsSection} ${nonEmptyPositionsSection}`}>
            <Card
                aria-live="polite"
                data-name="cashFundCompensations"
                innerHorizontalGap={!hasFullView}
                header={
                    <CardHeader title={localize(i18n, 'trader.cashFundCompensations.title')}>
                        <Hint
                            className={inlineRight}
                            content={localize(i18n, 'trader.cashFundCompensations.descriptionHint')}
                        />
                    </CardHeader>
                }>
                {hasFullView ? (
                    <CashFundCompensationsFullView getPayoutControl={getPayoutControl} tableItems={compensations} />
                ) : (
                    <CashFundCompensationsCompactView getPayoutControl={getPayoutControl} tableItems={compensations} />
                )}
            </Card>
        </div>
    );
};

export default React.memo(CashFundCompensations);
