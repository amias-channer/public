import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AgendaEconomicItem as AgendaEconomicItemType} from '../../../../models/agenda';
import {I18nContext} from '../../../app-component/app-context';
import CountryFlag from '../../../country-flag';
import {nbsp, valuesDelimiter} from '../../../value';
import Amount from '../../../value/amount';
import {countryFlag} from '../agenda.css';
import getActualValueClassName from '../helpers/get-actual-value-class-name';
import getEconomicPeriodLabelSuffix from '../helpers/get-economic-period-label-suffix';
import ProductLink from '../product-link/index';
import {
    agendaItemLink,
    agendaValue,
    companyName,
    companyNameContent,
    companyNameSuffix,
    countryCode as countryCodeClassName,
    firstColumn,
    secondColumn
} from './markets-agenda-card.css';

interface Props {
    item: AgendaEconomicItemType;
}

const {useContext, memo} = React;
const AgendaEconomicItem = memo<Props>(({item}) => {
    const i18n = useContext(I18nContext);
    const {eventId, productInfo, actual, previous, countryCode = ''} = item;

    return (
        <ProductLink productInfo={productInfo} className={agendaItemLink}>
            <div className={firstColumn}>
                <CountryFlag country={countryCode} className={countryFlag} />
                <span className={countryCodeClassName}>{countryCode}</span>
            </div>
            <div className={secondColumn}>
                <div className={companyName}>
                    <span className={companyNameContent}>{item.name}</span>
                    <span className={companyNameSuffix}>{getEconomicPeriodLabelSuffix(item.period)}</span>
                </div>
                <div className={agendaValue}>
                    {localize(i18n, 'trader.markets.agenda.actualShort')}
                    {nbsp}
                    <Amount
                        id={eventId}
                        className={getActualValueClassName(actual, previous)}
                        value={actual}
                        field="actual"
                    />
                    {valuesDelimiter}
                    {localize(i18n, 'trader.markets.agenda.expectedShort')}
                    {nbsp}
                    <Amount id={eventId} value={item.forecast} field="forecast" />
                    {valuesDelimiter}
                    {localize(i18n, 'trader.markets.agenda.previousShort')}
                    {nbsp}
                    <Amount id={eventId} value={previous} field="previous" />
                </div>
            </div>
        </ProductLink>
    );
});

AgendaEconomicItem.displayName = 'AgendaEconomicItem';
export default AgendaEconomicItem;
