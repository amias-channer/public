import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../../app-component/app-context';
import PopupHintButton from '../../../popup-button/popup-hint-button';
import CardHeader from '../../../card/header';
import PopupContent from '../../popup-content';
import keyProjectionsTooltips from '../../tooltips-data/refinitiv-key-projections-tooltips';

interface Props {
    hasTooltips: boolean;
}

const {useContext} = React;
const Header: React.FunctionComponent<Props> = ({hasTooltips}) => {
    const i18n = useContext(I18nContext);

    return (
        <CardHeader
            title={
                <>
                    {localize(i18n, 'trader.productDetails.analystViews.keyProjections.title')}
                    {hasTooltips && isTouchDevice() && (
                        <PopupHintButton
                            title={localize(i18n, 'trader.productDetails.analystViews.keyProjections.title')}>
                            <PopupContent tooltips={keyProjectionsTooltips} />
                        </PopupHintButton>
                    )}
                </>
            }
        />
    );
};

export default React.memo(Header);
