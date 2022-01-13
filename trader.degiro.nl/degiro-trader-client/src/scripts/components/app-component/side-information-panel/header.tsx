import Icon, {IconType} from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-context';
import {header as headerClassName, headerActionButton} from './side-information-panel.css';

export interface PanelHeaderProps {
    actionIcon?: IconType;
    className?: string;
    onAction(): void;
}

const {useContext} = React;
const PanelHeader: React.FunctionComponent<PanelHeaderProps> = ({
    children,
    className = '',
    actionIcon = 'close',
    onAction
}) => {
    const i18n = useContext(I18nContext);

    return (
        <header className={`${headerClassName} ${className}`}>
            {children}
            <button
                type="button"
                data-name="actionButton"
                aria-label={localize(i18n, 'modals.closeTitle')}
                onClick={onAction}
                className={headerActionButton}>
                <Icon type={actionIcon} />
            </button>
        </header>
    );
};

export default React.memo<React.PropsWithChildren<PanelHeaderProps>>(PanelHeader);
