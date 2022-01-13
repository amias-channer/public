import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, LinkProps} from 'react-router-dom';
import {I18nContext} from '../app-component/app-context';
import {viewMoreLink} from './view-more-link.css';

const {useContext} = React;
const ViewMoreLink: React.FunctionComponent<LinkProps> = React.memo(({className = '', children, ...props}) => {
    const i18n = useContext(I18nContext);

    return (
        <Link {...props} className={`${viewMoreLink} ${className}`}>
            {children || localize(i18n, 'trader.productDetails.viewMore')}
            <Icon type="keyboard_arrow_right" />
        </Link>
    );
});

ViewMoreLink.displayName = 'ViewMoreLink';
export default ViewMoreLink;
