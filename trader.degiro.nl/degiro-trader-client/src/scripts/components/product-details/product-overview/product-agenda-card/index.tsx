import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {DateRange} from 'frontend-core/dist/services/filter/get-filter-period';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import * as React from 'react';
import {Link} from 'react-router-dom';
import agendaCalendarImgUrl from '../../../../../images/svg/agenda-calendar.svg';
import {
    AgendaDividendItem,
    AgendaEarningItem,
    AgendaPeriodTypes,
    AgendaTypeIds,
    AgendaDividendsFiltersData,
    AgendaEarningsFiltersData
} from '../../../../models/agenda';
import getAgendaDateRangeByPeriodType from '../../../../services/agenda/get-agenda-date-range-by-period-type';
import getAgendaDividends from '../../../../services/agenda/get-agenda-dividends';
import getAgendaEarnings from '../../../../services/agenda/get-agenda-earnings';
import serializeAgendaSearchParams from '../../../../services/agenda/serialize-agenda-search-params';
import {nbsp, valuePlaceholder} from '../../../value';
import Amount from '../../../value/amount';
import DateValue from '../../../value/date';
import RelativeDifference from '../../../value/relative-difference';
import {actionLink} from '../../../../../styles/link.css';
import {
    agendaItemTitle,
    agendaCalendarImg,
    agendaCard,
    agendaItem,
    agendaItemField,
    agendaItemLinkIcon
} from './product-agenda-card.css';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import AgendaEarningCast from '../../../markets/agenda/agenda-earnings/agenda-earnings-cast';
import getAgendaEarningsFiltersOptions from '../../../../services/agenda/get-agenda-earnings-filters-options';
import getAgendaDividendsFiltersOptions from '../../../../services/agenda/get-agenda-dividends-filters-options';

interface Props {
    productInfo: ProductInfo;
}

const {useState, useEffect, useContext, useMemo} = React;
const {startDate, endDate}: DateRange = getAgendaDateRangeByPeriodType(
    AgendaPeriodTypes.NEXT_SIX_MONTHS_INCLUDING_TODAY
);
const ProductAgendaCard: React.FunctionComponent<Props> = ({productInfo: {isin}}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const [agendaDividendItem, setAgendaDividendItem] = useState<AgendaDividendItem | undefined>(undefined);
    const [agendaEarningItem, setAgendaEarningItem] = useState<AgendaEarningItem | undefined>(undefined);
    const [agendaEarningsPeriod, setAgendaEarningsPeriod] = useState<DateRange | undefined>(undefined);
    const [agendaDividendsPeriod, setAgendaDividendsPeriod] = useState<DateRange | undefined>(undefined);
    const {
        eventId: dividentEventId,
        paymentDate,
        dividend,
        exDividendDate,
        yield: yieldValue,
        organizationName: dividendOrganizationName = ''
    } = agendaDividendItem || {};
    const {eventId: earningEventId, dateTime: earningDateTime, organizationName: earningOrganizationName = ''} =
        agendaEarningItem || {};
    const dividendsQueryString: string = useMemo(() => {
        if (!agendaDividendsPeriod) {
            return '';
        }

        return getQueryString(
            serializeAgendaSearchParams<AgendaDividendsFiltersData>({
                searchText: dividendOrganizationName,
                agendaPeriodType: AgendaPeriodTypes.CUSTOM,
                fromDate: agendaDividendsPeriod.startDate,
                toDate: agendaDividendsPeriod.endDate
            })
        );
    }, [agendaDividendsPeriod?.startDate, agendaDividendsPeriod?.endDate, dividendOrganizationName]);
    const earningsQueryString: string = useMemo(() => {
        if (!agendaEarningsPeriod) {
            return '';
        }

        return getQueryString(
            serializeAgendaSearchParams<AgendaEarningsFiltersData>({
                searchText: earningOrganizationName,
                agendaPeriodType: AgendaPeriodTypes.CUSTOM,
                fromDate: agendaEarningsPeriod.startDate,
                toDate: agendaEarningsPeriod.endDate
            })
        );
    }, [agendaEarningsPeriod?.startDate, agendaEarningsPeriod?.endDate, earningOrganizationName]);

    useEffect(() => {
        const agendaItemsParams = {
            isin,
            startDate,
            endDate,
            offset: 0,
            limit: 1
        };
        const initialDataPromise = createCancellablePromise(
            Promise.all([
                getAgendaEarnings(config, {...agendaItemsParams, calendarType: AgendaTypeIds.EARNING}),
                getAgendaDividends(config, {...agendaItemsParams, calendarType: AgendaTypeIds.DIVIDEND}),
                getAgendaEarningsFiltersOptions(config),
                getAgendaDividendsFiltersOptions(config)
            ])
        );

        initialDataPromise.promise
            .then(
                ([
                    earnings,
                    dividends,
                    {periodBoundaries: earningsPeriodBoundaries},
                    {periodBoundaries: dividendsPeriodBoundaries}
                ]) => {
                    setAgendaEarningItem(earnings.items[0]);
                    setAgendaDividendItem(dividends.items[0]);
                    setAgendaEarningsPeriod({
                        startDate: earningsPeriodBoundaries.start,
                        endDate: earningsPeriodBoundaries.end
                    });
                    setAgendaDividendsPeriod({
                        startDate: dividendsPeriodBoundaries.start,
                        endDate: dividendsPeriodBoundaries.end
                    });
                }
            )
            .catch(logErrorLocally);

        return initialDataPromise.cancel;
    }, [isin]);

    return (
        <div data-name="productAgenda" className={agendaCard}>
            <div className={agendaItem}>
                <h2 className={agendaItemTitle}>
                    {localize(i18n, 'trader.productDetails.dividends')}
                    {dividentEventId && (
                        <Link
                            to={`${Routes.MARKETS_AGENDA}/${AgendaTypeIds.DIVIDEND}?${dividendsQueryString}`}
                            className={actionLink}>
                            <Icon className={agendaItemLinkIcon} type="fill_circle_arrow_right" />
                        </Link>
                    )}
                </h2>
                <div className={agendaItemField}>
                    {localize(i18n, 'trader.productDetails.exDividend')}:{nbsp}
                    <DateValue id="agendaDividendItemExDividendDate" value={exDividendDate} field="exDividendDate" />
                </div>
                <div className={agendaItemField}>
                    {localize(i18n, 'trader.productDetails.paymentDate')}:{nbsp}
                    <DateValue id="agendaDividendItemPaymentDate" value={paymentDate} field="paymentDate" />
                </div>
                <div className={agendaItemField}>
                    {localize(i18n, 'trader.productDetails.dividend')}:{nbsp}
                    <Amount id="agendaDividendItemDividend" value={dividend} field="dividend" />
                </div>
                <div className={agendaItemField}>
                    {localize(i18n, 'trader.markets.agenda.yield')}:{nbsp}
                    {/* By design we do not want '-%' suffix when there is no data */}
                    {yieldValue ? (
                        <RelativeDifference id="agendaDividendItemYield" field="yield" value={yieldValue} />
                    ) : (
                        valuePlaceholder
                    )}
                </div>
            </div>
            <div className={agendaItem}>
                <h2 className={agendaItemTitle}>
                    {localize(i18n, 'trader.productDetails.earnings')}
                    {earningEventId && (
                        <Link
                            to={`${Routes.MARKETS_AGENDA}/${AgendaTypeIds.EARNING}?${earningsQueryString}`}
                            className={actionLink}>
                            <Icon className={agendaItemLinkIcon} type="fill_circle_arrow_right" />
                        </Link>
                    )}
                </h2>
                <div className={agendaItemField}>
                    {localize(i18n, 'trader.productDetails.next')}:{nbsp}
                    <DateValue id="agendaEarningItemDateTime" value={earningDateTime} field="dateTime" />
                </div>
                {agendaEarningItem && <AgendaEarningCast item={agendaEarningItem} isFakeLink={true} />}
            </div>
            <img width={80} height={50} className={agendaCalendarImg} src={agendaCalendarImgUrl} alt="Calendar icon" />
        </div>
    );
};

export default React.memo(ProductAgendaCard);
