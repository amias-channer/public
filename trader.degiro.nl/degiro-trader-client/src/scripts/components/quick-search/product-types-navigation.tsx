import {ProductType} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import SubNavigation, {SubNavigationProps} from '../navigation/sub-navigation';
import {activeNavigationItem, navigationItem} from '../navigation/sub-navigation/sub-navigation.css';

interface Props extends SubNavigationProps {
    productTypes: ProductType[];
    selectedProductType?: ProductType;
    onSelect(productType: ProductType | undefined): void;
}

const {useContext} = React;
const ProductTypesNavigation: React.FunctionComponent<Props> = ({
    productTypes,
    selectedProductType,
    onSelect,
    ...rootProps
}) => {
    const i18n = useContext(I18nContext);

    return (
        <SubNavigation {...rootProps}>
            <button
                type="button"
                className={`${navigationItem} ${selectedProductType ? '' : activeNavigationItem}`}
                onClick={() => onSelect(undefined)}>
                {localize(i18n, 'trader.portfolio.positionTypes.all')}
            </button>
            {productTypes.map((productType: ProductType) => (
                <button
                    type="button"
                    onClick={() => onSelect(productType)}
                    className={`${navigationItem} ${
                        selectedProductType?.id === productType.id ? activeNavigationItem : ''
                    }`}
                    key={String(productType.id)}>
                    {localize(i18n, productType.translation)}
                </button>
            ))}
        </SubNavigation>
    );
};

export default React.memo(ProductTypesNavigation);
