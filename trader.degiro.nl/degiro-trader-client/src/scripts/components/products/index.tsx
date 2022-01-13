import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import useAsync from 'frontend-core/dist/hooks/use-async';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import canViewProductType from 'frontend-core/dist/services/product-type/can-view-product-type';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import {Location} from 'history';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {Routes} from '../../navigation';
import getProductsSearchProductTypes from '../../services/product-type/get-products-search-product-types';
import AccountRestrictionMessage from '../account-restriction-message/index';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from '../app-component/app-context';
import Alerts from '../inbox/alerts/index';
import SubNavigation from '../navigation/sub-navigation/index';
import SubNavigationLink from '../navigation/sub-navigation/sub-navigation-link';
import Page from '../page/index';
import PageWrapper from '../page/page-wrapper';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert/index';
import Spinner from '../progress-bar/spinner';
import useStateFromLocationSearch from '../../hooks/use-state-from-location-search';

const OptionsSearch = createLazyComponent(
    () =>
        // @ts-ignore TS2322 TODO: Remove this comment after refactoring Options class
        import(/* webpackChunkName: "options-search" */ './options/search')
);
const SearchByProductType = createLazyComponent(
    () => import(/* webpackChunkName: "search-by-product-type" */ './search-by-product-type')
);
const {useMemo, useContext} = React;
const isActiveProductTypeId = (productTypeId: ProductTypeIds, _match: unknown, location: Location) => {
    return new RegExp(`productType=${productTypeId}(&|$)`).test(location.search);
};
const Products: React.FunctionComponent = () => {
    const app = useContext(AppApiContext);
    const eventBroker = useContext(EventBrokerContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const history = useHistory();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const {isLoading, value: productTypes = []} = useAsync<ProductType[]>(
        () => getProductsSearchProductTypes(config, currentClient),
        [config, currentClient]
    );
    const {data: productTypeId} = useStateFromLocationSearch<number>((search): number =>
        Number(parseUrlSearchParams(search).productType)
    );
    const selectedProductType = useMemo<ProductType>(
        () => productTypes.find(({id}: ProductType) => id === productTypeId) || productTypes[0],
        [productTypeId, productTypes]
    );
    const userCanView = useMemo<boolean>(() => {
        return selectedProductType ? canViewProductType(selectedProductType, currentClient) : false;
    }, [currentClient, selectedProductType]);

    useDocumentTitle(selectedProductType ? localize(i18n, selectedProductType.translation) : document.title);

    return (
        <PageWrapper data-name="products">
            <SubNavigation compact={hasGlobalFullLayout}>
                {productTypes.map(
                    ({translation, id}: ProductType): React.ReactNode => (
                        <SubNavigationLink
                            key={id}
                            isActive={isActiveProductTypeId.bind(null, id)}
                            to={`${Routes.PRODUCTS}?productType=${id}`}>
                            {localize(i18n, translation)}
                        </SubNavigationLink>
                    )
                )}
            </SubNavigation>
            <OpenedTasksAlert />
            <Alerts />
            <Page>
                {isLoading && <Spinner />}
                {!isLoading &&
                    selectedProductType &&
                    userCanView &&
                    (selectedProductType.id === ProductTypeIds.OPTION ? (
                        <OptionsSearch
                            history={history}
                            app={app}
                            i18n={i18n}
                            eventBroker={eventBroker}
                            config={config}
                            mainClient={mainClient}
                            currentClient={currentClient}
                            hasGlobalFullLayout={hasGlobalFullLayout}
                            productType={selectedProductType}
                        />
                    ) : (
                        <SearchByProductType productType={selectedProductType} />
                    ))}
                {!isLoading && selectedProductType && !userCanView && (
                    <AccountRestrictionMessage moduleName={selectedProductType?.translation} />
                )}
            </Page>
        </PageWrapper>
    );
};

Products.displayName = 'Products';
export default Products;
