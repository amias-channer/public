import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';

interface Props {
    areValuesVisible: boolean;
    className?: string;
    iconClassName?: string;
    onClick: (event: React.MouseEvent) => void;
}

const {useContext, memo} = React;
const ValuesVisibilityButton = memo<Props>(({areValuesVisible, onClick, className, iconClassName}) => {
    const i18n = useContext(I18nContext);

    return (
        <button
            type="button"
            aria-label={
                areValuesVisible
                    ? localize(i18n, 'trader.accountSummary.settings.dataVisibility.show')
                    : localize(i18n, 'trader.accountSummary.settings.dataVisibility.hide')
            }
            data-name="valuesVisibilityButton"
            data-value={areValuesVisible ? 'off' : 'on'}
            onClick={onClick}
            className={className}>
            <Icon className={iconClassName} type={areValuesVisible ? 'visibility' : 'visibility_off'} />
        </button>
    );
});

ValuesVisibilityButton.displayName = 'ValuesVisibilityButton';
export default ValuesVisibilityButton;
