import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../../app-component/app-context';
import NoDataMessage from '../../../no-data-message';
import {layout} from './no-news-message.css';

interface Props {
    className?: string;
}

const {useContext} = React;
const NoNewsMessage: React.FunctionComponent<Props> = ({className = ''}) => {
    const i18n = useContext(I18nContext);

    return (
        <NoDataMessage className={`${layout} ${className}`}>
            {localize(i18n, 'trader.markets.news.noNewsForSelectedFilters')}
        </NoDataMessage>
    );
};

export default React.memo(NoNewsMessage);
