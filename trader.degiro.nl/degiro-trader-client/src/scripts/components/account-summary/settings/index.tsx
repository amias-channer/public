import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {AccountSummaryPositions} from 'frontend-core/dist/models/app-settings';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Hint from '../../hint';
import {panelToggleButton, settingsToggle} from './settings.css';
import SettingsListToggle from './settings-menu';
import {selectableButtonWithBackdrop} from '../../button/button.css';

interface Props {
    isPanelOpened: boolean;
    onPanelToggle(): void;
    panelPosition: AccountSummaryPositions;
    onPanelPositionChange(panelPosition: AccountSummaryPositions): void;
}

const {useContext, memo} = React;
const SettingsButtons = memo<Props>(({isPanelOpened, panelPosition, onPanelPositionChange, onPanelToggle}) => {
    const i18n = useContext(I18nContext);

    return (
        <>
            <SettingsListToggle
                panelPosition={panelPosition}
                className={settingsToggle}
                onPanelPositionChange={onPanelPositionChange}
            />
            <Hint
                data-name="panelToggleButton"
                className={`${selectableButtonWithBackdrop} ${panelToggleButton}`}
                content={localize(
                    i18n,
                    isPanelOpened
                        ? 'trader.accountSummary.settings.minimizePanel'
                        : 'trader.accountSummary.settings.maximizePanel'
                )}
                onClick={onPanelToggle}>
                <Icon
                    type="keyboard_arrow_down"
                    flipped={panelPosition === AccountSummaryPositions.BOTTOM ? !isPanelOpened : isPanelOpened}
                />
            </Hint>
        </>
    );
});

SettingsButtons.displayName = 'SettingsButtons';
export default SettingsButtons;
