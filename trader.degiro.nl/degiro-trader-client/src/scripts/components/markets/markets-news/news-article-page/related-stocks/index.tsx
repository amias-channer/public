import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {verticalScrollPanel} from 'frontend-core/dist/components/ui-trader4/scroll-panel/scroll-panel.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import Accordion, {AccordionItemId} from '../../../../accordion';
import AccordionItem from '../../../../accordion/accordion-item';
import {I18nContext} from '../../../../app-component/app-context';
import CardHeader from '../../../../card-obsolete/header';
import NoProductsMessage from '../../../../no-products-message';
import Spinner from '../../../../progress-bar/spinner';
import AccordionItemHeader from './accordion-item-header';
import ProductPricesInfo from './product-prices-info';
import {
    accordionItem,
    accordionItemContent,
    cardHeaderWithoutLeftPadding,
    chartPeriodFilterLayout,
    chartPeriodsItem,
    chartWrapper,
    item,
    noProductsLabel,
    productChart
} from './related-stocks.css';

const ProductChart = createLazyComponent(
    () => import(/* webpackChunkName: "product-chart" */ '../../../../product-chart')
);

interface Props {
    className?: string;
    relatedProducts?: ProductInfo[];
    isEmbeddedCard?: boolean;
}

const {useContext} = React;
const initialOpenedAccordionItemIds: AccordionItemId[] = ['0'];
const RelatedStocks: React.FunctionComponent<Props> = ({relatedProducts, className = '', isEmbeddedCard = false}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={`${verticalScrollPanel} ${className}`}>
            <CardHeader
                className={isEmbeddedCard ? cardHeaderWithoutLeftPadding : undefined}
                title={localize(i18n, 'trader.markets.news.relatedStocks')}
            />
            {!relatedProducts ? (
                <Spinner />
            ) : relatedProducts.length > 0 ? (
                <div className={verticalScrollPanel}>
                    <Accordion initialOpenedItemIds={initialOpenedAccordionItemIds}>
                        {({toggle, openedItemIds}) =>
                            relatedProducts.map((productInfoAccordionItem: ProductInfo, index: number) => {
                                const id: string = index.toString();

                                return (
                                    <AccordionItem
                                        className={`${item} ${isEmbeddedCard ? '' : accordionItem}`}
                                        header={<AccordionItemHeader productInfo={productInfoAccordionItem} />}
                                        isOpened={openedItemIds.includes(id)}
                                        key={id}
                                        onToggle={toggle.bind(null, id)}>
                                        <ProductPricesInfo
                                            productInfo={productInfoAccordionItem}
                                            className={accordionItemContent}
                                        />
                                        <ProductChart
                                            className={productChart}
                                            productInfo={productInfoAccordionItem}
                                            hasHiddenSettings={true}
                                            hasHiddenDetailsLink={true}
                                            wrapperClassName={chartWrapper}
                                            chartPeriodsItemClassName={chartPeriodsItem}
                                            chartPeriodFilterLayoutClass={chartPeriodFilterLayout}
                                        />
                                    </AccordionItem>
                                );
                            })
                        }
                    </Accordion>
                </div>
            ) : (
                <NoProductsMessage className={noProductsLabel} />
            )}
        </div>
    );
};

export default React.memo(RelatedStocks);
