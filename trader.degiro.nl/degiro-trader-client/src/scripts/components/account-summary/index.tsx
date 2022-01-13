import useLocalStorageState from 'frontend-core/dist/hooks/use-local-storage-state';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {AccountSummaryPositions} from 'frontend-core/dist/models/app-settings';
import * as React from 'react';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {AccountSummaryEvents} from '../../event-broker/event-types';
import {Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import useLatestTransactions from '../../hooks/use-latest-transactions';
import useOpenOrders from '../../hooks/use-open-orders';
import {smallViewportMinWidth, xMediumViewportMinWidth} from '../../media-queries';
import {EventBrokerContext} from '../app-component/app-context';
import {
    accountSummaryButton,
    accountSummaryButtonIcon,
    accountSummaryIcon,
    bottomLayout,
    clickableLayout,
    content,
    fullLayout,
    layout,
    nonClickableArea,
    valuesVisibilityPlaceholder
} from './account-summary.css';
import ExpandedPaymentsInfo from './payments-info/expanded-payments-info';
import MinimizedPaymentsInfo from './payments-info/minimized-payments-info';
import PaymentsNavigation from './payments-info/payments-navigation';
import AvailableCosts from './sections/available-costs';
import CashValue from './sections/cash-value';
import PortfolioDiffForDay from './sections/portfolio-diff-for-day';
import PortfolioDiffForAllTime from './sections/portfolio-diff-for-all-time';
import PortfolioBalance from './sections/portfolio-balance';
import PortfolioValue from './sections/portfolio-value';
import Settings from './settings';
import {sections, sectionsAsSingleRow, sectionsMobileView} from './sections/sections.css';
import {settingsListActiveButton, buttonsPanel} from './settings/settings.css';
import ValuesVisibilityButton from './values-visibility-button';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {footer} from '../app-component/app-component.css';
import useAccountSummaryPosition from '../app-component/hooks/use-account-summary-position';
import {
    layout as expandedPaymentsLayout,
    oneColumnLayout,
    twoColumnsLayout
} from './payments-info/expanded-payments-info/expanded-payments-info.css';
import {selectableButtonWithBackdrop} from '../button/button.css';
import useAccountSummaryValueVisibility from './hooks/use-account-summary-value-visibility';

const {useEffect, useContext, useCallback, memo} = React;
const AccountSummary = memo(() => {
    const [position, onPositionChange] = useAccountSummaryPosition();
    const compact: boolean = !useGlobalFullLayoutFlag();
    const eventBroker = useContext(EventBrokerContext);
    const [areValuesVisible, setValuesVisibility] = useAccountSummaryValueVisibility();
    const [isOpened, setIsOpened] = useLocalStorageState('isAccountSummaryOpened', false);
    const open = useCallback(() => setIsOpened(true), [setIsOpened]);
    const close = useCallback(() => setIsOpened(false), [setIsOpened]);
    const toggle = useCallback(() => setIsOpened((isOpened) => !isOpened), [setIsOpened]);
    const {transactions} = useLatestTransactions();
    const orders = useOpenOrders() || [];
    const canShowPaymentsInfo: boolean = useMediaQuery(smallViewportMinWidth);
    const hasCompactPaymentsInfoLayout: boolean = !useMediaQuery(xMediumViewportMinWidth);
    const {isOpened: isPortfolioDiffForDay, toggle: togglePortfolioDiff} = useToggle();
    const toggleValuesVisibility = useCallback(() => setValuesVisibility(!areValuesVisible), [areValuesVisible]);

    useEffect(() => {
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.on(AccountSummaryEvents.OPEN, open),
            eventBroker.on(AccountSummaryEvents.CLOSE, close)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    useEffect(() => {
        // 1. compact layout should always closed by default
        // 2. close panel if we switch from "full" to "compact" layout (e.g. by resizing of browser window)
        if (compact) {
            close();
        }
    }, [compact]);

    if (compact && !isOpened) {
        return null;
    }

    return (
        <section
            className={`
                ${layout}
                ${compact ? '' : fullLayout} 
                ${compact ? '' : clickableLayout}
                ${position === AccountSummaryPositions.BOTTOM ? bottomLayout : ''}
                ${position === AccountSummaryPositions.TOP ? '' : footer}            
            `}
            data-name="accountSummary"
            onClick={compact ? undefined : toggle}>
            <div className={content}>
                {isOpened ? (
                    // key={1} and key={2} is a fix for preact bug with virtual dom update
                    <div
                        key={1}
                        onClick={stopEvent}
                        className={`${sections} ${canShowPaymentsInfo ? '' : sectionsMobileView} ${nonClickableArea}`}>
                        <PortfolioBalance />
                        <AvailableCosts isColumnContext={true} />
                        <PortfolioValue />
                        <CashValue isColumnContext={true} />
                        <PortfolioDiffForDay />
                        <PortfolioDiffForAllTime />
                    </div>
                ) : (
                    <div key={2} onClick={stopEvent} className={`${sectionsAsSingleRow} ${nonClickableArea}`}>
                        <PortfolioBalance />
                        <PortfolioValue />
                        <CashValue isColumnContext={false} />
                        <AvailableCosts isColumnContext={false} />
                        <button type="button" onClick={togglePortfolioDiff} className={accountSummaryButton}>
                            {isPortfolioDiffForDay && <PortfolioDiffForDay />}
                            {!isPortfolioDiffForDay && <PortfolioDiffForAllTime />}
                            <Icon
                                type="keyboard_arrow_down"
                                flipped={isPortfolioDiffForDay}
                                className={accountSummaryButtonIcon}
                            />
                        </button>
                    </div>
                )}
                {!compact && (
                    <div onClick={stopEvent} className={valuesVisibilityPlaceholder}>
                        <ValuesVisibilityButton
                            areValuesVisible={areValuesVisible}
                            onClick={toggleValuesVisibility}
                            iconClassName={accountSummaryIcon}
                            className={`${selectableButtonWithBackdrop} ${
                                areValuesVisible ? settingsListActiveButton : ''
                            }`}
                        />
                    </div>
                )}
                {canShowPaymentsInfo &&
                    (isOpened ? (
                        <div
                            onClick={stopEvent}
                            className={`${expandedPaymentsLayout} ${nonClickableArea} ${
                                hasCompactPaymentsInfoLayout ? oneColumnLayout : twoColumnsLayout
                            }`}>
                            <ExpandedPaymentsInfo
                                orders={orders}
                                transactions={transactions}
                                showProductDetails={!compact}
                                compact={hasCompactPaymentsInfoLayout}
                            />
                        </div>
                    ) : (
                        <MinimizedPaymentsInfo orders={orders} transactions={transactions} />
                    ))}
                {!compact && (
                    <div onClick={stopEvent} className={`${buttonsPanel} ${nonClickableArea}`}>
                        <Settings
                            panelPosition={position}
                            isPanelOpened={isOpened}
                            onPanelPositionChange={onPositionChange}
                            onPanelToggle={toggle}
                        />
                    </div>
                )}
            </div>
            {!canShowPaymentsInfo && <PaymentsNavigation orders={orders} transactions={transactions} />}
        </section>
    );
});

AccountSummary.displayName = 'AccountSummary';
export default AccountSummary;
