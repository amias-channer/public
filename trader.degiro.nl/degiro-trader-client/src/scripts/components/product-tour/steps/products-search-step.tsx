import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import logoUrl from '../../../../images/svg/products-search.svg';
import {I18nContext} from '../../app-component/app-context';
import ExternalHtmlContent from '../../external-html-content';
import {StepProps} from '../index';
import {stepDescription, stepLogo, stepTitle} from '../product-tour.css';

const {useContext} = React;
const ProductsSearchStep: React.FunctionComponent<StepProps> = ({showImg}) => {
    const i18n = useContext(I18nContext);

    return (
        <div data-name="productsSearchStep">
            {showImg && <img src={logoUrl} alt="" className={stepLogo} />}
            <h2 className={stepTitle}>{localize(i18n, 'trader.productTour.steps.productsSearch.title')}</h2>
            <ExternalHtmlContent className={stepDescription}>
                {localize(i18n, 'trader.productTour.steps.productsSearch.description')}
            </ExternalHtmlContent>
        </div>
    );
};

export default React.memo(ProductsSearchStep);
