import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import CardHeader from '../../card/header';
import Card from '../../card';
import ProductAnalystViewsChart, {ChartSizes} from '../product-analyst-views-chart';
import Disclaimer from '../../disclaimer';
import DateValue from '../../value/date';
import {nbsp} from '../../value';

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    hasFullView?: boolean;
    isCompactView?: boolean;
}

const {useContext} = React;
const BuySellSurvey: React.FunctionComponent<Props> = ({companyRatios = {}, hasFullView, isCompactView}) => {
    const i18n = useContext(I18nContext);
    const lastYear: number = new Date().getFullYear() - 1;
    const {lastModified} = companyRatios;
    const recentCompanyRatios: RefinitivCompanyRatios | undefined =
        lastModified && new Date(lastModified) > new Date(lastYear, 6, 1) ? companyRatios : undefined;

    return (
        <Card
            data-name="buySellSurvey"
            header={<CardHeader title={localize(i18n, 'trader.productDetails.analystViews.buySellSurvey')} />}
            footer={
                lastModified ? (
                    <Disclaimer>
                        *{nbsp}
                        {localize(i18n, 'trader.productDetails.analystViews.estimations.lastUpdated')}:{nbsp}
                        <DateValue id="lastUpdated" field="lastUpdated" value={lastModified} />
                    </Disclaimer>
                ) : (
                    true
                )
            }>
            <ProductAnalystViewsChart
                companyRatios={recentCompanyRatios}
                size={hasFullView ? ChartSizes.LARGE : ChartSizes.SMALL}
                isCompactView={isCompactView}
            />
        </Card>
    );
};

export default React.memo(BuySellSurvey);
