import {Exchange} from 'frontend-core/dist/models/exchange';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Hint from '../hint/index';
import {badge, badgeWithDelayedValue, badgeWithEndOfDayValue} from './feed-quality.css';

interface Props {
    productInfo: ProductInfo;
    exchange?: Exchange;
}

const {useContext} = React;
const FeedQuality: React.FunctionComponent<Props> = ({productInfo, exchange = productInfo.exchange}) => {
    const i18n = useContext(I18nContext);
    let {feedQuality} = productInfo;

    // [WF-947] if we have no `feedQuality` field, it should be set to "End Of Day"
    if (!feedQuality || feedQuality === 'AFM') {
        feedQuality = 'ED';
    }

    const exchangeName: string | undefined = exchange?.name;
    const isDelayed: boolean = feedQuality[0] === 'D';
    const feedQualityLabel: string = localize(i18n, `trader.productDetails.feedQuality.${feedQuality}`);

    return (
        <Hint
            content={exchangeName ? `${exchangeName} - ${feedQualityLabel}` : feedQualityLabel}
            data-id={productInfo.id}
            data-field="feedQuality"
            data-value={feedQuality}
            className={`
                ${badge}
                ${isDelayed ? badgeWithDelayedValue : feedQuality === 'ED' ? badgeWithEndOfDayValue : ''}
            `}>
            {isDelayed ? feedQuality.slice(1) : feedQuality}
        </Hint>
    );
};

export default React.memo(FeedQuality);
