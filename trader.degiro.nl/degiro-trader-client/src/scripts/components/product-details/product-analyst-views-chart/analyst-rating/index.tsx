import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../../app-component/app-context';
import Amount from '../../../value/amount';
import {
    analystRatingAxis,
    analystRatingContainer,
    fullAnalystRatingContainer,
    analystRatingScale,
    axisLabel,
    currentValuePointer,
    pointerEnd,
    pointerStart,
    positionRelative
} from './analyst-rating.css';

interface Props {
    value: number;
    hasFullView?: boolean;
}

const {useContext} = React;
const AnalystRating: React.FunctionComponent<Props> = ({value, hasFullView}) => {
    const i18n = useContext(I18nContext);
    const normalizedValue = ((value - 1) / 4) * 100;
    const valuePointerStyle =
        normalizedValue <= 50 ? {left: `${normalizedValue}%`} : {right: `${100 - normalizedValue}%`};

    return (
        <div className={`${analystRatingContainer} ${hasFullView ? fullAnalystRatingContainer : ''}`}>
            <div className={positionRelative}>
                <div
                    style={/* eslint-disable-line react/forbid-dom-props */ valuePointerStyle}
                    className={`${currentValuePointer} ${normalizedValue <= 50 ? pointerStart : pointerEnd}`}>
                    {localize(i18n, 'trader.productDetails.analystViews.curMean')}
                    <Amount id="analystRating" field="value" brackets={true} value={value} />
                </div>
                <dl className={analystRatingAxis}>
                    <dt className={axisLabel}>1</dt>
                    <dd className={axisLabel}>{localize(i18n, 'trader.productDetails.analystViews.buy')}</dd>
                    <dt className={axisLabel}>2</dt>
                    <dd className={axisLabel}>{localize(i18n, 'trader.productDetails.analystViews.outperform')}</dd>
                    <dt className={axisLabel}>3</dt>
                    <dd className={axisLabel}>{localize(i18n, 'trader.productDetails.analystViews.hold')}</dd>
                    <dt className={axisLabel}>4</dt>
                    <dd className={axisLabel}>{localize(i18n, 'trader.productDetails.analystViews.underperform')}</dd>
                    <dt className={axisLabel}>5</dt>
                    <dd className={axisLabel}>{localize(i18n, 'trader.productDetails.analystViews.sell')}</dd>
                </dl>
                <div className={analystRatingScale} />
            </div>
        </div>
    );
};

export default React.memo(AnalystRating);
