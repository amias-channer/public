import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {closeButton} from './alerts.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const {useContext} = React;
const AlertCloseButton: React.FunctionComponent<Props> = ({className = '', ...buttonProps}) => {
    const i18n = useContext(I18nContext);

    return (
        <button
            type="button"
            data-name="alertCloseButton"
            aria-label={localize(i18n, 'modals.closeTitle')}
            className={`${closeButton} ${className}`}
            {...buttonProps}>
            <Icon type="close" />
        </button>
    );
};

export default React.memo(AlertCloseButton);
