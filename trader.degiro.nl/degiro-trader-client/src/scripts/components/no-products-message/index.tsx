import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import NoDataMessage from '../no-data-message/index';

interface Props {
    className?: string;
}

const {useContext} = React;
const NoProductsMessage: React.FunctionComponent<Props> = ({className}) => {
    const i18n = useContext(I18nContext);

    return <NoDataMessage className={className}>{localize(i18n, 'trader.productsTable.noProducts')}</NoDataMessage>;
};

export default React.memo(NoProductsMessage);
