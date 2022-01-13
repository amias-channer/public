import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {hiddenValue} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {MarginCallStatuses} from 'frontend-core/dist/models/total-portfolio';
import localize from 'frontend-core/dist/services/i18n/localize';
import {TotalPortfolioCostTypeField} from 'frontend-core/dist/services/total-portfolio';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Statuses} from '../../../models/status';
import getTotalPortfolioCostTypeFields from '../../../services/total-portfolio/get-total-portfolio-cost-type-fields';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import StatusIcon from '../../status/status-icon';
import Amount from '../../value/amount';
import {nbsp} from '../../value';
import {
    moreInfoButton,
    moreInfoButtonWithRightSeparator,
    section as sectionClassName,
    sectionLabel,
    sectionToggle,
    sectionValue
} from './sections.css';
import useOpenAvailableCostsInfoModal from '../../app-component/hooks/use-open-available-costs-info-modal';
import {
    accountSummaryButton,
    accountSummaryButtonIcon,
    accountSummaryIcon,
    flexContext,
    primaryFlexSection
} from '../account-summary.css';
import useTotalPortfolio from '../../../hooks/use-total-portfolio';
import {selectableButtonWithBackdrop} from '../../button/button.css';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

export const labels: Record<TotalPortfolioCostTypeField, string> = {
    availableToSpend: 'trader.totalPortfolio.availableToSpend',
    marginReport: 'trader.totalPortfolio.marginReport',
    overnightReport: 'trader.totalPortfolio.overnightReport'
};

interface FieldsState {
    costTypeFields: TotalPortfolioCostTypeField[];
    costTypeField: TotalPortfolioCostTypeField;
}

interface Props {
    isColumnContext: boolean;
}

function getNextCostTypeField<T = TotalPortfolioCostTypeField>(costTypeFields: T[], costTypeField: T): T | undefined {
    const nextCostTypeIndex: number = costTypeFields.indexOf(costTypeField) + 1;

    return costTypeFields[nextCostTypeIndex];
}

const {useState, useContext} = React;
const AvailableCosts: React.FunctionComponent<Props> = ({isColumnContext}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const [areValuesVisible] = useAccountSummaryValueVisibility();
    const {totalPortfolio} = useTotalPortfolio();
    const [{costTypeFields, costTypeField}, setFields] = useState<FieldsState>(() => {
        const {fields: costTypeFields, defaultField: costTypeField} = getTotalPortfolioCostTypeFields(currentClient);

        return {costTypeFields, costTypeField};
    });
    const showAdditionalInfo = useOpenAvailableCostsInfoModal();
    const changeCostType = () => {
        setFields(({costTypeFields, costTypeField}) => ({
            costTypeFields,
            costTypeField: getNextCostTypeField(costTypeFields, costTypeField) || costTypeFields[0]
        }));
    };
    const {marginCallStatus} = totalPortfolio;
    const canChangeCostType: boolean = costTypeFields.length > 1;
    const isMarginCallOpen: boolean = marginCallStatus === MarginCallStatuses.OPEN;
    const isMarginCallPassedDeadline: boolean = marginCallStatus === MarginCallStatuses.IN_LIQUIDATION;
    const canShowAdditionalInfo: boolean =
        isMarginCallOpen ||
        isMarginCallPassedDeadline ||
        currentClient.isBasic ||
        currentClient.isCustodyClient ||
        currentClient.isCustodyPensionClient ||
        costTypeFields.length > 0;
    // if we can't change the cost type we trigger the same action as for additional info button
    const costTypeButtonClickHandler: React.MouseEventHandler<HTMLButtonElement> | undefined = canChangeCostType
        ? changeCostType
        : canShowAdditionalInfo
        ? showAdditionalInfo
        : undefined;

    return (
        <div className={flexContext}>
            <button
                type="button"
                data-name="costTypeButton"
                className={`${primaryFlexSection} ${canChangeCostType ? accountSummaryButton : ''}`}
                disabled={!costTypeButtonClickHandler}
                onClick={costTypeButtonClickHandler}>
                <div className={sectionClassName}>
                    <span className={sectionToggle}>
                        <Amount
                            id="totalPortfolio"
                            field={costTypeField}
                            className={`${sectionValue} ${areValuesVisible ? '' : hiddenValue}`}
                            prefix={`${getCurrencySymbol(config.baseCurrency)}${nbsp}`}
                            value={totalPortfolio[costTypeField]}
                        />
                        {isMarginCallOpen && <StatusIcon status={Statuses.WARNING} className={inlineRight} />}
                        {isMarginCallPassedDeadline && <StatusIcon status={Statuses.ALERT} className={inlineRight} />}
                        <span className={sectionLabel}>
                            {localize(i18n, canChangeCostType ? labels[costTypeField] : labels.availableToSpend)}
                        </span>
                    </span>
                </div>
                {canChangeCostType && (
                    <Icon
                        type="keyboard_arrow_down"
                        className={accountSummaryButtonIcon}
                        flipped={Boolean(getNextCostTypeField(costTypeFields, costTypeField))}
                    />
                )}
            </button>
            {canShowAdditionalInfo && (
                <div
                    className={
                        !canChangeCostType && !isColumnContext ? moreInfoButtonWithRightSeparator : moreInfoButton
                    }>
                    <button
                        aria-label={localize(i18n, 'trader.totalPortfolio.openFreeSpaceInfo')}
                        title={localize(i18n, 'trader.totalPortfolio.openFreeSpaceInfo')}
                        data-name="freeSpaceInfoButton"
                        onClick={showAdditionalInfo}
                        type="button"
                        className={selectableButtonWithBackdrop}>
                        <Icon className={accountSummaryIcon} type="info" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(AvailableCosts);
