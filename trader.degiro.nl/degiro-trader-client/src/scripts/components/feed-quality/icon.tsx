import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Hint from '../hint';

const {useContext} = React;
const FeedQualityIcon: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);

    return <Hint content={localize(i18n, 'trader.productDetails.feedQualityHint')} />;
};

export default React.memo(FeedQualityIcon);
