import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {AccountSummaryPositions} from 'frontend-core/dist/models/app-settings';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {activeButtonWithBackdrop, selectableButtonWithBackdrop} from '../../button/button.css';
import {icon} from '../../hint/hint.css';
import Menu from '../../menu';
import ValuesVisibilityButton from '../values-visibility-button';
import {settingsList, settingsListActiveButton, settingsListButton, settingsListItem} from './settings.css';
import useAccountSummaryValueVisibility from '../hooks/use-account-summary-value-visibility';

interface Props {
    panelPosition: AccountSummaryPositions;
    onPanelPositionChange(panelPosition: AccountSummaryPositions): void;
    className?: string;
}

const {useContext, useCallback, memo} = React;
const SettingsMenu = memo<Props>(({panelPosition, onPanelPositionChange, className = ''}) => {
    const i18n = useContext(I18nContext);
    const toggle = useToggle(false);
    const [areValuesVisible, setAccountSummaryValueVisibility] = useAccountSummaryValueVisibility();
    const setAccountSummaryValueVisibilityOn = useCallback(() => setAccountSummaryValueVisibility(true), []);
    const setAccountSummaryValueVisibilityOff = useCallback(() => setAccountSummaryValueVisibility(false), []);

    return (
        <Menu
            targetWrapperClassName={className}
            onClose={toggle.close}
            target={
                <button
                    data-test-key="open-menu-button"
                    type="button"
                    aria-label={localize(i18n, 'trader.navigation.settings')}
                    onClick={toggle.toggle}
                    className={toggle.isOpened ? activeButtonWithBackdrop : selectableButtonWithBackdrop}>
                    <Icon type="settings_outline" className={icon} />
                </button>
            }
            isOpened={toggle.isOpened}>
            <ul className={settingsList}>
                <li className={settingsListItem}>
                    {localize(i18n, 'trader.accountSummary.settings.dataVisibility')}
                    <ValuesVisibilityButton
                        areValuesVisible={true}
                        onClick={setAccountSummaryValueVisibilityOn}
                        className={`
                            ${selectableButtonWithBackdrop}
                            ${settingsListButton} 
                            ${areValuesVisible ? settingsListActiveButton : ''}
                        `}
                    />
                    <ValuesVisibilityButton
                        areValuesVisible={false}
                        onClick={setAccountSummaryValueVisibilityOff}
                        className={`
                            ${selectableButtonWithBackdrop}
                            ${settingsListButton} 
                            ${areValuesVisible ? '' : settingsListActiveButton}
                        `}
                    />
                </li>
                <li className={settingsListItem}>
                    {localize(i18n, 'trader.accountSummary.settings.layoutPosition')}
                    <button
                        type="button"
                        data-name="layoutButton"
                        data-value="top"
                        onClick={onPanelPositionChange.bind(null, AccountSummaryPositions.TOP)}
                        className={`
                            ${selectableButtonWithBackdrop} 
                            ${settingsListButton} 
                            ${panelPosition === AccountSummaryPositions.TOP ? settingsListActiveButton : ''}
                        `}>
                        <Icon type="layout_top" />
                    </button>
                    <button
                        type="button"
                        data-name="layoutButton"
                        data-value="bottom"
                        onClick={onPanelPositionChange.bind(null, AccountSummaryPositions.BOTTOM)}
                        className={`
                            ${selectableButtonWithBackdrop}
                            ${settingsListButton}
                            ${panelPosition === AccountSummaryPositions.BOTTOM ? settingsListActiveButton : ''}
                        `}>
                        <Icon type="layout_top" flipped={true} />
                    </button>
                </li>
            </ul>
        </Menu>
    );
});

SettingsMenu.displayName = 'SettingsMenu';
export default SettingsMenu;
