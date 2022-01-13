import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Select, {SelectOption, SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getFilterPeriod, {DateRange} from 'frontend-core/dist/services/filter/get-filter-period';
import localize from 'frontend-core/dist/services/i18n/localize';
import getStocksByIsins from 'frontend-core/dist/services/products/stock/get-stocks-by-isins';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import getItemsIsins from 'frontend-core/dist/services/products/get-items-isins';
import startOfDay from 'frontend-core/dist/utils/date/start-of-day';
import * as React from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {
    AgendaAnyTypeItem,
    AgendaDividendItem as AgendaDividendItemType,
    AgendaEconomicItem as AgendaEconomicItemType,
    AgendaPeriodTypes,
    AgendaRequestParams,
    AgendaSearchResult,
    AgendaType,
    AgendaTypeIds,
    agendaTypes
} from '../../../../models/agenda';
import {Routes} from '../../../../navigation';
import addProductInfoToAgendaItems from '../../../../services/agenda/add-product-info-to-agenda-items';
import getAgendaDateRangeByPeriodType from '../../../../services/agenda/get-agenda-date-range-by-period-type';
import getAgendaDividendsPreview from '../../../../services/agenda/get-agenda-dividends-preview';
import getAgendaEconomics from '../../../../services/agenda/get-agenda-economics';
import isAgendaItemOfType from '../../../../services/agenda/is-agenda-item-of-type';
import {AppApiContext, ConfigContext, I18nContext} from '../../../app-component/app-context';
import CardHeader from '../../../card/header';
import NoDataMessage from '../../../no-data-message';
import Spinner from '../../../progress-bar/spinner';
import {agendaListItem, agendaNoData, item as listItem} from './markets-agenda-card.css';
import Card from '../../../card';
import {cardList} from '../../markets.css';
import {underlinedItem} from '../../../list/list.css';
import ViewMoreLink from '../../../view-more-link';

type AgendaSearchService = (
    config: Config,
    params: AgendaRequestParams
) => Promise<AgendaSearchResult<AgendaAnyTypeItem>>;

const totalItems = 7;
const economicCalendarCountryCodes = [
    'AT',
    'AU',
    'BE',
    'BR',
    'CA',
    'CH',
    'PO',
    'CZ',
    'HU',
    'FI',
    'FR',
    'DE',
    'GR',
    'HK',
    'IT',
    'IN',
    'IE',
    'JP',
    'LU',
    'NL',
    'NZ',
    'PT',
    'RU',
    'SG',
    'SK',
    'SI',
    'ZA',
    'KR',
    'SP',
    'CH',
    'SE',
    'UK',
    'US'
];
const AgendaDividendItem = createLazyComponent(
    () => import(/* webpackChunkName: "markets-agenda-dividend-item" */ './agenda-dividend-item')
);
const AgendaEconomicItem = createLazyComponent(
    () => import(/* webpackChunkName: "markets-agenda-economics-item" */ './agenda-economic-item')
);

function getAgendaItemsService(agendaTypeId: AgendaTypeIds): AgendaSearchService {
    switch (agendaTypeId) {
        case AgendaTypeIds.ECONOMIC:
            return getAgendaEconomics;
        default:
            return getAgendaDividendsPreview;
    }
}

function getAgendaFilters(agendaTypeId: AgendaTypeIds): Pick<AgendaRequestParams, 'countries'> | {} {
    switch (agendaTypeId) {
        case AgendaTypeIds.ECONOMIC:
            return {countries: economicCalendarCountryCodes};
        default:
            return {};
    }
}

const {useState, useEffect, useMemo, useContext, memo} = React;
const visibleAgendaTypeIds: AgendaTypeIds[] = [AgendaTypeIds.ECONOMIC, AgendaTypeIds.DIVIDEND];
const visibleAgendaTypes: AgendaType[] = agendaTypes.filter((agendaItem: AgendaType) =>
    visibleAgendaTypeIds.includes(agendaItem.id)
);
const MarketsAgendaCard = memo(() => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const options: SelectOption[] = useMemo(() => {
        return visibleAgendaTypes.map((type) => ({
            value: type.id,
            label: localize(i18n, type.translation)
        }));
    }, [i18n]);
    const [agendaTypeId, setAgendaTypeId] = useState(AgendaTypeIds.ECONOMIC);
    const {startDate, endDate}: DateRange = useMemo(() => {
        switch (agendaTypeId) {
            case AgendaTypeIds.ECONOMIC: {
                return getFilterPeriod({value: startOfDay(new Date())}, null, {daysRange: 8});
            }
            default:
                return getAgendaDateRangeByPeriodType(AgendaPeriodTypes.NEXT_SEVEN_DAYS_INCLUDING_TODAY);
        }
    }, [agendaTypeId]);
    const {isLoading, value: agendaItems, error} = useAsyncWithProgressiveState<AgendaAnyTypeItem[]>(async () => {
        const getAgendaItems = getAgendaItemsService(agendaTypeId);
        const filterParams = getAgendaFilters(agendaTypeId);
        const getProductsForAgendaItems = (agendaItems: AgendaAnyTypeItem[]): Promise<ProductInfo[]> => {
            const isins: string[] = getItemsIsins<AgendaAnyTypeItem>(agendaItems);

            return isNonEmptyArray(isins) ? getStocksByIsins(config, isins) : Promise.resolve([]);
        };
        const {items}: AgendaSearchResult<AgendaAnyTypeItem> = await getAgendaItems(config, {
            ...filterParams,
            calendarType: agendaTypeId,
            offset: 0,
            limit: totalItems,
            orderByDesc: false,
            startDate,
            endDate
        });
        const products: ProductInfo[] = await getProductsForAgendaItems(items);

        return addProductInfoToAgendaItems(items, products);
    }, [startDate, endDate, agendaTypeId]);

    useEffect(() => {
        if (error) {
            app.openModal({error});
            logErrorLocally(error);
        }
    }, [error]);

    return (
        <Card
            innerHorizontalGap={false}
            data-name="marketAgenda"
            header={
                <CardHeader title={localize(i18n, 'trader.markets.agenda.title')}>
                    <Select
                        size={SelectSizes.XSMALL}
                        onChange={setAgendaTypeId}
                        selectedOption={agendaTypeId && options.find((option) => option.value === agendaTypeId)}
                        options={options}
                        name="agendaTypeId"
                    />
                </CardHeader>
            }
            footer={
                <ViewMoreLink to={`${Routes.MARKETS_AGENDA}/${agendaTypeId}`}>
                    {localize(i18n, 'trader.markets.agenda.goTo')}
                </ViewMoreLink>
            }>
            {isLoading && !agendaItems && <Spinner />}
            {agendaItems && !isNonEmptyArray(agendaItems) && (
                <NoDataMessage className={`${agendaNoData} ${isLoading ? loading : ''}`} />
            )}
            {isNonEmptyArray(agendaItems) && (
                <div className={`${cardList} ${isLoading ? loading : ''}`}>
                    {agendaItems.map((item: AgendaAnyTypeItem, index) => (
                        <div
                            key={index}
                            data-id={item.isin}
                            className={`${listItem} ${agendaListItem} ${underlinedItem}`}>
                            {isAgendaItemOfType<AgendaEconomicItemType>(item, AgendaTypeIds.ECONOMIC) && (
                                <AgendaEconomicItem item={item} />
                            )}
                            {isAgendaItemOfType<AgendaDividendItemType>(item, AgendaTypeIds.DIVIDEND) && (
                                <AgendaDividendItem item={item as AgendaDividendItemType} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
});

MarketsAgendaCard.displayName = 'MarketsAgendaCard';
export default MarketsAgendaCard;
