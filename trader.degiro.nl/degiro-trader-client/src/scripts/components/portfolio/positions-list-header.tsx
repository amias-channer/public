import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import Hint from '../hint';
import {switchIcon, accentValues, valuesSwitchButton} from './portfolio.css';
import {I18nContext} from '../app-component/app-context';
import {PositionTypeIds} from './position-types';

interface Props {
    arePositionValuesSwitched: boolean;
    onPositionValuesSwitch: () => void;
    positionTypeId: PositionTypeIds;
}

const {useContext} = React;
const PositionsListHeader = React.memo<Props>(({arePositionValuesSwitched, onPositionValuesSwitch, positionTypeId}) => {
    const i18n = useContext(I18nContext);
    const areAllPositionsInactive: boolean = positionTypeId === PositionTypeIds.INACTIVE;

    return (
        <div
            aria-label="button"
            className={valuesSwitchButton}
            data-name="switchValuesButton"
            onClick={() => onPositionValuesSwitch()}>
            {arePositionValuesSwitched && (
                <>
                    <span>
                        <Icon type="arrow_drop_up" className={switchIcon} />
                        {localize(i18n, 'trader.productsTable.priceColumn')}
                        {!areAllPositionsInactive && (
                            <>
                                {', '}
                                <span className={accentValues}>
                                    {localize(i18n, 'trader.portfolio.breakEvenPriceColumn')}
                                </span>
                                <Hint
                                    className={inlineRight}
                                    onClick={stopEvent}
                                    content={localize(i18n, 'trader.portfolio.breakEvenPriceHint')}
                                />
                            </>
                        )}
                    </span>
                    <span className={accentValues}>
                        {localize(
                            i18n,
                            areAllPositionsInactive
                                ? 'trader.portfolio.realizedPlColumn'
                                : 'trader.portfolio.unrealizedPlColumn'
                        )}
                        <Hint
                            className={inlineRight}
                            onClick={stopEvent}
                            content={localize(
                                i18n,
                                areAllPositionsInactive
                                    ? 'trader.portfolio.realizedPlHint'
                                    : 'trader.portfolio.unrealizedPlHint'
                            )}
                        />
                    </span>
                </>
            )}
            {!arePositionValuesSwitched && (
                <>
                    <span>
                        <Icon type="arrow_drop_down" className={switchIcon} />
                        {localize(i18n, 'trader.productsTable.priceColumn')}
                        {' × '}
                        <span className={accentValues}>{localize(i18n, 'trader.productsTable.quantityColumn')}</span>
                    </span>
                    <span className={accentValues}>{localize(i18n, 'trader.portfolio.valuesSwitch.todayPl')}</span>
                </>
            )}
        </div>
    );
});

PositionsListHeader.displayName = 'PositionsListHeader';

export default PositionsListHeader;
