import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getLeveragedProducts from 'frontend-core/dist/services/products/leveraged/get-leveraged-products';
import getOptions from 'frontend-core/dist/services/products/option/get-options';
import * as React from 'react';
import {useRouteMatch} from 'react-router-dom';
import useAsync from 'frontend-core/dist/hooks/use-async';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {ProductSubLinks} from '../../navigation';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import SubNavigation from '../navigation/sub-navigation/index';
import SubNavigationLink from '../navigation/sub-navigation/sub-navigation-link';
import getProductDetailsTabsVisibility, {ProductDetailsTabsVisibility} from './get-product-details-tabs-visibility';

interface Props {
    productInfo: ProductInfo;
}

const {useEffect, useContext, useMemo, memo} = React;
const Navigation = memo<Props>(({productInfo}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const tabsVisibility = useMemo<Partial<ProductDetailsTabsVisibility>>(
        () => getProductDetailsTabsVisibility(productInfo, currentClient),
        [productInfo, currentClient]
    );
    const productId: string = String(productInfo.id);
    const {isin: underlyingIsin} = productInfo;
    const {url} = useRouteMatch();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const {value: areOptionsAvailable = false, error: optionsFetchError} = useAsync<boolean>(async () => {
        if (!tabsVisibility.options || !underlyingIsin) {
            return false;
        }

        const {total} = await getOptions(config, {underlyingIsin, requireData: false, requireTotal: true});

        // we don't need the data of options, just check options are available or not
        return (total as number) > 0;
    }, [productId, underlyingIsin, tabsVisibility.options, config]);
    const {value: areLeveragedAvailable = false, error: leveragedFetchError} = useAsync<Boolean>(async () => {
        if (!tabsVisibility.leveragedProducts) {
            return false;
        }
        const {total} = await getLeveragedProducts(config, currentClient, {
            underlyingProductId: productId,
            requireData: false,
            requireTotal: true
        });

        // we don't need the data of leveraged products, just check they are available or not
        return (total as number) > 0;
    }, [productId, config, currentClient]);

    useEffect(() => {
        if (leveragedFetchError || optionsFetchError) {
            logErrorLocally(leveragedFetchError || optionsFetchError);
        }
    }, [leveragedFetchError, optionsFetchError]);

    return (
        <SubNavigation compact={hasGlobalFullLayout}>
            <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.OVERVIEW}`}>
                {localize(i18n, 'trader.productDetails.tabs.overview')}
            </SubNavigationLink>
            {tabsVisibility.companyProfile && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.COMPANY_PROFILE}`}>
                    {localize(i18n, 'trader.productDetails.companyProfile.title')}
                </SubNavigationLink>
            )}
            {tabsVisibility.financials && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.FINANCIALS}`}>
                    {localize(i18n, 'trader.productDetails.tabs.financials')}
                </SubNavigationLink>
            )}
            {tabsVisibility.ratios && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.RATIOS}`}>
                    {localize(i18n, 'trader.productDetails.ratios.title')}
                </SubNavigationLink>
            )}
            {tabsVisibility.ownership && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.OWNERSHIP}`}>
                    {localize(i18n, 'trader.productDetails.ownership.title')}
                </SubNavigationLink>
            )}
            {tabsVisibility.analystViews && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.ANALYST_VIEWS}`}>
                    {localize(i18n, 'trader.productDetails.analystViews.title')}
                </SubNavigationLink>
            )}
            {tabsVisibility.esgRatings && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.ESG_RATINGS}`}>
                    {localize(i18n, 'trader.productDetails.ESGRatings.title')}{' '}
                </SubNavigationLink>
            )}
            <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.DOCUMENTS}`}>
                {localize(i18n, 'trader.productDetails.tabs.documents')}
            </SubNavigationLink>
            {tabsVisibility.options && areOptionsAvailable && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.OPTIONS}`}>
                    {localize(i18n, 'trader.productDetails.tabs.options')}
                </SubNavigationLink>
            )}
            {tabsVisibility.leveragedProducts && areLeveragedAvailable && (
                <SubNavigationLink replace={true} to={`${url}/${ProductSubLinks.LEVERAGED_PRODUCTS}`}>
                    {localize(i18n, 'trader.productDetails.tabs.leveragedProducts')}
                </SubNavigationLink>
            )}
        </SubNavigation>
    );
});

Navigation.displayName = 'Navigation';
export default Navigation;
