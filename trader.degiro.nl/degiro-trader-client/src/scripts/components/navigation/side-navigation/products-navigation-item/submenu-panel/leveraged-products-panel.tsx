import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {LeveragedProductIssuer, LeveragedProductIssuerItem} from 'frontend-core/dist/models/leveraged';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {FilterOption} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {I18nContext} from '../../../../app-component/app-context';
import useMenuKeyboardNavigation from '../../../../menu/hooks/use-menu-keyboard-navigation';
import {secondaryNavigationItem, secondaryNavigationTitle} from './submenu-panel.css';

interface Props {
    issuers: [LeveragedProductIssuerItem, ...LeveragedProductIssuerItem[]];
    onClose(): void;
}

const {useContext, useCallback, useRef} = React;
const LeveragedProductsPanel: React.FunctionComponent<Props> = ({issuers, onClose}) => {
    const menuRef = useRef<HTMLUListElement>(null);
    const i18n = useContext(I18nContext);
    const closePanel = useCallback(() => onClose(), [onClose]);

    useMenuKeyboardNavigation(menuRef, true);

    return (
        <>
            <h2 className={secondaryNavigationTitle}>{localize(i18n, 'contract.type.14')}</h2>
            <ul role="menu" ref={menuRef}>
                {issuers.map((issuer) => (
                    <li key={String(issuer.id)} role="menuitem">
                        <Link
                            to={`${Routes.PRODUCTS}?productType=${ProductTypeIds.LEVERAGED}&issuer=${issuer.id}`}
                            className={secondaryNavigationItem}
                            onClick={closePanel}>
                            {(issuer as FilterOption).label || (issuer as LeveragedProductIssuer).name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default React.memo(LeveragedProductsPanel);
