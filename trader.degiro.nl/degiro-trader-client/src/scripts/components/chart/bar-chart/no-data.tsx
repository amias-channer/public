import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {chartTextNoData} from './bar-chart.css';

const {useContext} = React;
const NoData: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);

    return (
        <text
            className={chartTextNoData}
            x="50%"
            y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-weight="500">
            {localize(i18n, 'trader.noDataToDisplay')}
        </text>
    );
};

export default React.memo(NoData);
