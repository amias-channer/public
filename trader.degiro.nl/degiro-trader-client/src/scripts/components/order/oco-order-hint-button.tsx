import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, I18nContext} from '../app-component/app-context';
import {selectableButtonWithBackdrop} from '../button/button.css';

interface Props {
    className?: string;
}

const {useContext} = React;
const OcoOrderHintButton: React.FunctionComponent<Props> = ({className = ''}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const onClick = () => {
        app.openModal({
            content: localize(i18n, 'trader.orderForm.oco.orderTypeHint.description'),
            footer: null
        });
    };

    return (
        <button type="button" onClick={onClick} className={`${selectableButtonWithBackdrop} ${className}`}>
            <Icon hintIcon={true} />
        </button>
    );
};

export default React.memo(OcoOrderHintButton);
