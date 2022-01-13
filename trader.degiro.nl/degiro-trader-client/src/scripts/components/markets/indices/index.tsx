import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {WorldMarketIndex} from 'frontend-core/dist/models/market-index';
import localize from 'frontend-core/dist/services/i18n/localize';
import getWorldMarketsIndices from 'frontend-core/dist/services/market-index/get-world-markets-indices';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import CardHeader from '../../card/header';
import Card from '../../card';
import ProductsCarousel from '../products-carousel/index';
import MarketIndicesListView from './list-view';

const ProductChart = createLazyComponent(() => import(/* webpackChunkName: "product-chart" */ '../../product-chart'));

interface Props {
    isListView: boolean;
}

const {useState, useEffect, useContext} = React;
const MarketIndices: React.FunctionComponent<Props> = ({isListView}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const [indices, setIndices] = useState<WorldMarketIndex[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<WorldMarketIndex | undefined>();
    const isProductChartVisible: boolean = !isListView && selectedIndex !== undefined;

    useEffect(() => {
        const indicesPromise = createCancellablePromise(getWorldMarketsIndices(config, currentClient));

        indicesPromise.promise
            .then((indices: WorldMarketIndex[]) => {
                setIndices(indices);
                setSelectedIndex(indices[0]);
            })
            .catch(logErrorLocally);

        return indicesPromise.cancel;
    }, [config, currentClient]);

    return (
        <Card
            innerHorizontalGap={!isListView}
            data-name="marketIndices"
            header={<CardHeader title={localize(i18n, 'trader.markets.indices.title')} />}>
            {isListView ? (
                <MarketIndicesListView products={indices} />
            ) : indices.length ? (
                <ProductsCarousel<WorldMarketIndex>
                    withNavigationButtons={hasGlobalFullLayout}
                    selectedProduct={selectedIndex}
                    onSelect={setSelectedIndex}
                    products={indices}
                />
            ) : null}
            {isProductChartVisible && selectedIndex && <ProductChart productInfo={selectedIndex} />}
        </Card>
    );
};

export default React.memo(MarketIndices);
