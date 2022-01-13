import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import isNextAppVersionAvailable from 'frontend-core/dist/services/app-version-settings/is-next-app-version-available';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import useTradingSettingsItems from '../../../../hooks/use-trading-settings-items';
import {TradingSettingsIds, TradingSettingsItem} from '../../../../models/trading-settings';
import {Routes} from '../../../../navigation';
import isSettingsLinkActive from '../../../../services/router/is-settings-link-active';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import AppVersionToggle from '../../../app-version-toggle';
import BlockMenu, {BlockMenuProps} from '../../../menu/block-menu';
import BlockMenuDivider from '../../../menu/block-menu/block-menu-divider';
import BlockMenuItemLayout from '../../../menu/block-menu/block-menu-item-layout';
import BlockMenuTitle from '../../../menu/block-menu/block-menu-title';
import {
    activeNavigationItem,
    navigationItem,
    navigationItemIcon,
    navigationItemToggleIcon,
    openedNavigationItem
} from '../side-navigation.css';

const {useCallback, useContext, useMemo} = React;
const SettingsMenu = () => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const tradingSettingsItems = useTradingSettingsItems();
    const [primaryItems, secondaryItems] = useMemo(
        () =>
            tradingSettingsItems.reduce<[TradingSettingsItem[], TradingSettingsItem[]]>(
                (acc, item) => {
                    // Move data sharing item to secondary list displayed below divider
                    acc[Number(item.id === TradingSettingsIds.DATA_SHARING)].push(item);
                    return acc;
                },
                [[], []]
            ),
        [tradingSettingsItems]
    );
    const isActive = isSettingsLinkActive(location);
    const hasNextAppVersion = isNextAppVersionAvailable(config);
    const hasSecondaryItems = secondaryItems.length > 0 || hasNextAppVersion;
    const title = localize(i18n, 'trader.navigation.settings');
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Link
                to={Routes.SETTINGS}
                data-active={isActive}
                aria-label={title}
                className={`${navigationItem} ${isActive ? activeNavigationItem : ''} ${
                    isOpened ? openedNavigationItem : ''
                }`}
                onClick={deactivateActiveElement}
                onFocus={open}
                onMouseLeave={close}
                onMouseOver={open}>
                <Icon className={navigationItemIcon} type={isActive ? 'settings' : 'settings_outline'} />
                <Icon className={navigationItemToggleIcon} type="arrow_drop_down" />
            </Link>
        ),
        [isActive, title]
    );

    return (
        <BlockMenu renderTarget={renderTarget} verticalPosition="inside-start">
            <BlockMenuTitle>{title}</BlockMenuTitle>
            <nav aria-label={title}>
                <ul>
                    {primaryItems.map(({id, to, iconUrl, label, description}) => (
                        <li key={id}>
                            <Link to={to}>
                                <BlockMenuItemLayout
                                    preserveIconSpace={true}
                                    iconUrl={iconUrl}
                                    title={label}
                                    description={description}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
                {hasSecondaryItems && <BlockMenuDivider />}
                {hasSecondaryItems && (
                    <ul>
                        {secondaryItems.map(({id, to, iconUrl, label, description}) => (
                            <li key={id}>
                                <Link to={to}>
                                    <BlockMenuItemLayout
                                        preserveIconSpace={true}
                                        iconUrl={iconUrl}
                                        title={label}
                                        description={description}
                                    />
                                </Link>
                            </li>
                        ))}
                        {hasNextAppVersion && (
                            <li>
                                <AppVersionToggle>
                                    {({label}) => <BlockMenuItemLayout preserveIconSpace={true} title={label} />}
                                </AppVersionToggle>
                            </li>
                        )}
                    </ul>
                )}
            </nav>
        </BlockMenu>
    );
};

export default SettingsMenu;
