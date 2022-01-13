import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {MarketIndex} from 'frontend-core/dist/models/market-index';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {StockCountry} from 'frontend-core/dist/models/stock';
import {filterOptionAllId, filterOptionAllLabel} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {StocksNavigation} from '../../../../../../models/stock';
import {I18nContext} from '../../../../../app-component/app-context';
import useMenuKeyboardNavigation from '../../../../../menu/hooks/use-menu-keyboard-navigation';
import {secondaryAllLink, secondaryNavigationItem, secondaryNavigationTitle} from '../submenu-panel.css';
import {
    regionCountriesList,
    regionCountriesListItem,
    regionSection,
    sectionsContainer,
    sectionsDivider
} from './stocks-panel.css';

interface Props {
    stocksNavigation: StocksNavigation;
    onClose(): void;
}

const {useContext, useCallback, useRef} = React;
const StocksPanel: React.FunctionComponent<Props> = ({stocksNavigation, onClose}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const i18n = useContext(I18nContext);
    const closePanel = useCallback(() => onClose(), [onClose]);

    useMenuKeyboardNavigation(rootRef, true);

    return (
        <div ref={rootRef}>
            <div className={sectionsContainer}>
                {stocksNavigation.topCountries.map(({id, translation, indices, exchanges}: StockCountry) => {
                    const baseUrl = `${Routes.PRODUCTS}?productType=${ProductTypeIds.STOCK}&country=${id}`;

                    return (
                        <section key={String(id)}>
                            <h3 className={secondaryNavigationTitle}>{localize(i18n, translation)}</h3>
                            <ul role="menu">
                                {indices.map(({id, name}: MarketIndex) => (
                                    <li key={String(id)} role="menuitem">
                                        <Link
                                            to={`${baseUrl}&stockListType=index&stockList=${id}`}
                                            className={secondaryNavigationItem}
                                            onClick={closePanel}>
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                                {exchanges.map(({id, name}: Exchange) => (
                                    <li key={String(id)} role="menuitem">
                                        <Link
                                            to={`${baseUrl}&stockListType=exchange&stockList=${id}`}
                                            className={secondaryNavigationItem}
                                            onClick={closePanel}>
                                            {name}
                                        </Link>
                                    </li>
                                ))}
                                <li role="menuitem">
                                    <Link
                                        to={`${baseUrl}&stockList=${filterOptionAllId}`}
                                        className={secondaryAllLink}
                                        onClick={closePanel}>
                                        {localize(i18n, filterOptionAllLabel)}
                                    </Link>
                                </li>
                            </ul>
                        </section>
                    );
                })}
            </div>
            <div className={sectionsDivider} />
            <div className={sectionsContainer}>
                {stocksNavigation.regionalCountries.map(({region, countries}) => (
                    <section key={String(region.id)} className={regionSection}>
                        <h3 className={secondaryNavigationTitle}>{localize(i18n, region.translation)}</h3>
                        <ul role="menu" className={regionCountriesList}>
                            {countries.map(({id, translation}: StockCountry) => (
                                <li key={String(id)} role="menuitem" className={regionCountriesListItem}>
                                    <Link
                                        to={`${Routes.PRODUCTS}?productType=${ProductTypeIds.STOCK}&country=${id}`}
                                        className={secondaryNavigationItem}
                                        onClick={closePanel}>
                                        {localize(i18n, translation)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default React.memo(StocksPanel);
