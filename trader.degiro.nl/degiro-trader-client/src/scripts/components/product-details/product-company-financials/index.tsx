import Select, {SelectOption, SelectSizes} from 'frontend-core/dist/components/ui-trader4/select';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {StatementPeriodTypes, StatementTypes, UnifiedStatements} from '../../../models/financial-statement';
import getCompanyFinancialsChartPoints from '../../../services/financial-statement/get-company-financials-chart-points';
import BarChartGrouped from '../../chart/bar-chart/bar-chart-grouped';
import {greenPalette} from '../../chart/constants';
import useDefaultLabelFormatter from '../../chart/bar-chart/hooks/use-default-label-formatter';
import CardHeader from '../../card/header';
import Card from '../../card';
import GroupSelect, {GroupSelectOption} from '../../group-select/index';
import ChartLegend, {LegendItem} from '../chart-legend/index';
import {
    financialsCardLayout,
    statementPeriodItem,
    statementTypesSelect,
    noDataMessage
} from './product-company-financials.css';
import ViewMoreLink from '../../view-more-link';
import NoDataMessage from '../no-data-message';
import {I18nContext} from '../../app-component/app-context';
import {ProductSubLinks, Routes} from '../../../navigation';

interface Props {
    productInfo: ProductInfo;
    financialStatements?: UnifiedStatements;
    className?: string;
    isFullView: boolean;
}

const {useContext} = React;
const {useMemo, useState} = React;
const ProductCompanyFinancials: React.FunctionComponent<Props> = ({productInfo, financialStatements, isFullView}) => {
    const i18n = useContext(I18nContext);
    const [statementType, setStatementType] = useState<StatementTypes>(StatementTypes.INCOME);
    const [statementPeriod, setStatementPeriod] = useState<StatementPeriodTypes>(StatementPeriodTypes.YEAR);
    const chartData = useMemo(() => {
        return financialStatements
            ? getCompanyFinancialsChartPoints(financialStatements[statementPeriod], statementType)
            : [];
    }, [financialStatements, statementPeriod, statementType]);
    const statementTypeOptions: SelectOption[] = useMemo(
        () => [
            {value: StatementTypes.INCOME, label: localize(i18n, 'trader.productDetails.financials.incomeStatement')},
            {value: StatementTypes.BALANCE, label: localize(i18n, 'trader.productDetails.financials.balanceSheet')},
            {value: StatementTypes.CASH_FLOW, label: localize(i18n, 'trader.productDetails.financials.cashFlow')}
        ],
        [i18n]
    );
    const periodTypeOptions: GroupSelectOption<StatementPeriodTypes>[] = useMemo(
        () => [
            {id: StatementPeriodTypes.YEAR, label: localize(i18n, 'trader.productDetails.financials.annual')},
            {id: StatementPeriodTypes.QUARTER, label: localize(i18n, 'trader.productDetails.tabs.interim')}
        ],
        [i18n]
    );
    const legend: LegendItem[] = useMemo(() => {
        return {
            [StatementTypes.INCOME]: [
                {name: localize(i18n, 'trader.productDetails.financials.revenue'), color: greenPalette[0]},
                {name: localize(i18n, 'trader.productDetails.financials.netIncome'), color: greenPalette[1]}
            ],
            [StatementTypes.BALANCE]: [
                {name: localize(i18n, 'trader.productDetails.financials.totalAssets'), color: greenPalette[0]},
                {name: localize(i18n, 'trader.productDetails.financials.totalLiabilities'), color: greenPalette[1]}
            ],
            [StatementTypes.CASH_FLOW]: [
                {name: localize(i18n, 'trader.productDetails.financials.cash'), color: greenPalette[0]},
                {name: localize(i18n, 'trader.productDetails.financials.netChangeInCash'), color: greenPalette[1]}
            ]
        }[statementType];
    }, [statementType, i18n]);
    const labelFormatter = useDefaultLabelFormatter(!isFullView);

    return (
        <Card
            data-name="companyFinancials"
            header={
                <CardHeader title={localize(i18n, 'trader.productDetails.financials.title')}>
                    <Select
                        name="statementsType"
                        className={statementTypesSelect}
                        options={statementTypeOptions}
                        onChange={setStatementType}
                        selectedOption={statementTypeOptions.find((option) => option.value === statementType)}
                        size={SelectSizes.XSMALL}
                    />
                </CardHeader>
            }
            footer={<ViewMoreLink to={`${Routes.PRODUCTS}/${productInfo.id}/${ProductSubLinks.FINANCIALS}`} />}>
            <div className={financialsCardLayout}>
                <GroupSelect<StatementPeriodTypes>
                    name="statementsPeriod"
                    options={periodTypeOptions}
                    onChange={setStatementPeriod}
                    selectedOptionId={statementPeriod}
                    itemClassName={statementPeriodItem}
                />
                {chartData.length > 0 ? (
                    <>
                        <BarChartGrouped
                            chartData={chartData}
                            currency={financialStatements?.currency}
                            labelFormatter={labelFormatter}
                            colors={greenPalette}
                        />
                        <ChartLegend legend={legend} />
                    </>
                ) : (
                    <NoDataMessage hasCompactLayout={!isFullView} className={noDataMessage} />
                )}
            </div>
        </Card>
    );
};

export default React.memo(ProductCompanyFinancials);
