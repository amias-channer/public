import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {closeButton} from './promotion.css';

interface Props {
    onClick(): void;
}

const {useCallback, useContext} = React;
const PromotionCloseButton: React.FunctionComponent<Props> = ({onClick}) => {
    const i18n = useContext(I18nContext);
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            // stop event on parent button or link
            stopEvent(event);
            onClick();
        },
        [onClick]
    );

    return (
        <button
            type="button"
            data-name="closeButton"
            className={closeButton}
            aria-label={localize(i18n, 'modals.closeTitle')}
            onClick={handleClick}>
            <Icon type="close" />
        </button>
    );
};

export default React.memo(PromotionCloseButton);
