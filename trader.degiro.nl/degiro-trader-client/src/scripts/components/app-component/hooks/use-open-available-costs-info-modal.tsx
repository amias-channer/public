import * as React from 'react';
import {buttonsLine} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import {TotalPortfolioCostTypeField} from 'frontend-core/dist/services/total-portfolio';
import {ModalSizes} from '../../modal';
import TextValue from '../../value/text';
import MarginCallStatusBox from '../../account-summary/margin-call-status/status-box';
import {marginCallStatusBox} from '../../account-summary/account-summary.css';
import FreeCostsInfo from '../../account-summary/free-costs-info';
import ExternalHtmlContent from '../../external-html-content';
import CashOrderButton from '../../order/cash-order-button';
import {AppApiContext, CurrentClientContext, I18nContext} from '../app-context';
import getTotalPortfolioCostTypeFields from '../../../services/total-portfolio/get-total-portfolio-cost-type-fields';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';

const {useContext, useMemo, useCallback} = React;

export default function useOpenAvailableCostsInfoModal() {
    const {openModal, closeModal} = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const costTypeFields: TotalPortfolioCostTypeField[] = useMemo(
        () => getTotalPortfolioCostTypeFields(currentClient).fields,
        [currentClient]
    );
    const {totalPortfolio} = useTotalPortfolio();

    return useCallback(() => {
        openModal({
            size: ModalSizes.MEDIUM,
            title: (
                <>
                    {localize(i18n, 'trader.totalPortfolio.availableToSpend')}
                    {costTypeFields.length > 0 && (
                        <>
                            {' '}
                            {localize(i18n, 'trader.freeCostsInfo.calculationTitle')}
                            <TextValue
                                field="reportCreationTime"
                                id="totalPortfolio"
                                value={totalPortfolio.reportCreationTime}
                            />
                        </>
                    )}
                </>
            ),
            content: (
                <>
                    <MarginCallStatusBox totalPortfolio={totalPortfolio} className={marginCallStatusBox} />
                    {costTypeFields.length > 0 ? (
                        <FreeCostsInfo totalPortfolio={totalPortfolio} />
                    ) : (
                        <ExternalHtmlContent>
                            {localize(i18n, 'trader.dashboard.availableToTradeHint')}
                        </ExternalHtmlContent>
                    )}
                </>
            ),
            footer: (
                <div className={buttonsLine}>
                    <CashOrderButton onClick={closeModal} />
                </div>
            )
        });
    }, [totalPortfolio, costTypeFields, i18n, currentClient]);
}
