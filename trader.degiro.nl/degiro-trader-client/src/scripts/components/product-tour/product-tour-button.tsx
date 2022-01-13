import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {ProductTourEvents} from '../../event-broker/event-types';
import {EventBrokerContext, I18nContext} from '../app-component/app-context';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const {useCallback, useContext} = React;
const ProductTourButton: React.FunctionComponent<Props> = ({onClick, ...buttonProps}) => {
    const eventBroker = useContext(EventBrokerContext);
    const i18n = useContext(I18nContext);
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            // IMPORTANT: call custom callback before Product Tour event
            // because in this callback we can do some preparations or redirect
            onClick?.(event);
            eventBroker.emit(ProductTourEvents.START);
        },
        [eventBroker, onClick]
    );

    return (
        <button type="button" data-name="productTourButton" {...buttonProps} onClick={handleClick}>
            {buttonProps.children || localize(i18n, 'trader.navigation.productTour.title')}
        </button>
    );
};

export default React.memo(ProductTourButton);
