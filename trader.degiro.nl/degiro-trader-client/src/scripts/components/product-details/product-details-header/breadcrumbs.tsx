import ProductType from 'frontend-core/dist/components/ui-common/product-type';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {selectableText} from 'frontend-core/dist/components/ui-trader4/selection-utils.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import FeedQuality from '../../feed-quality';
import ProductBrief from '../../product-brief';
import * as classNames from './product-details-header.css';

interface BreadcrumbsProps {
    productInfo: ProductInfo;
    onBack(): void;
}

const {useContext} = React;
const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({productInfo, onBack}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();

    return (
        <div className={classNames.breadcrumbs}>
            {hasGlobalFullLayout && (
                <button
                    type="button"
                    data-name="backButton"
                    className={classNames.breadcrumbsBackButton}
                    onClick={onBack}>
                    <Icon type="arrow_back" />
                </button>
            )}
            {hasGlobalFullLayout && (
                <ProductType id={productInfo.productTypeId} config={config} i18n={i18n} fullName={true} />
            )}
            {hasGlobalFullLayout && <Icon type="keyboard_arrow_right" />}
            <ProductBrief
                productInfo={productInfo}
                className={`${classNames.breadcrumbsProductBrief} ${selectableText}`}>
                <FeedQuality productInfo={productInfo} />
            </ProductBrief>
        </div>
    );
};

export default React.memo(Breadcrumbs);
