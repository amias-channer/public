import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import Button, {ButtonVariants} from '../../button/index';
import CashOrderButton from '../../order/cash-order-button';
import {ClientAccountEvents} from '../../../event-broker/event-types';
import Drawer, {DrawerApi} from './drawer';
import {EventBrokerContext, I18nContext, MainClientContext} from '../../app-component/app-context';
import FeedbackButton from '../../feedback/button/index';
import InvitationLink from '../../profile/invitation/link';
import {Routes} from '../../../navigation';
import UserProfile from './user-profile';
import useUnreadMessagesCount from '../../inbox/hooks/use-unread-messages-count';
import {
    accentControlItem,
    controlItem,
    controlItemIcon,
    logoutButton,
    logoutButtonIcon,
    navigation,
    nextIcon,
    unreadMessagesIcon
} from './drawer-navigation.css';

interface Props {
    onApi(api: DrawerApi): void;
}

const {useCallback, useContext} = React;
const DrawerNavigation: React.FunctionComponent<Props> = ({onApi}) => {
    const eventBroker = useContext(EventBrokerContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const unreadMessagesCount: number = useUnreadMessagesCount();
    const {isAssetManager} = mainClient;
    const handleLogOutButtonClick = useCallback(() => eventBroker.emit(ClientAccountEvents.LOGOUT), []);

    return (
        <Drawer>
            {(drawerApi: DrawerApi) => {
                onApi(drawerApi);

                return (
                    <>
                        <nav className={navigation}>
                            <UserProfile />
                            <CashOrderButton className={accentControlItem}>
                                <Icon type="save_alt" className={controlItemIcon} />
                                {localize(i18n, 'trader.cashOrder.title')}
                            </CashOrderButton>
                            {isAssetManager && (
                                <Link to={Routes.CLIENTS} className={controlItem}>
                                    <Icon type="clients_outline" className={controlItemIcon} />
                                    {localize(i18n, 'trader.navigation.clients')}
                                </Link>
                            )}
                            <Link
                                to={Routes.INBOX}
                                title={localize(i18n, 'trader.navigation.inbox')}
                                className={controlItem}>
                                <Icon type="mail_outline" className={controlItemIcon} />
                                {localize(i18n, 'trader.navigation.inbox')}
                                {unreadMessagesCount > 0 && (
                                    <span className={unreadMessagesIcon}>{unreadMessagesCount}</span>
                                )}
                            </Link>
                            <Link
                                to={Routes.SETTINGS}
                                title={localize(i18n, 'trader.navigation.settings')}
                                className={controlItem}>
                                <Icon type="settings_outline" className={controlItemIcon} />
                                {localize(i18n, 'trader.navigation.settings')}
                                <Icon type="keyboard_arrow_right" className={nextIcon} />
                            </Link>
                            <Link
                                to={Routes.HELP}
                                title={localize(i18n, 'trader.navigation.support')}
                                className={controlItem}>
                                <Icon type="help_outline" className={controlItemIcon} />
                                {localize(i18n, 'trader.navigation.support')}
                                <Icon type="keyboard_arrow_right" className={nextIcon} />
                            </Link>
                            <InvitationLink className={controlItem}>
                                <Icon type="favorite_outline" className={controlItemIcon} />
                                {localize(i18n, 'trader.profile.invitation.title')}
                            </InvitationLink>
                            <FeedbackButton className={controlItem}>
                                <Icon type="feedback" className={controlItemIcon} />
                                {localize(i18n, 'trader.navigation.sendFeedback')}
                            </FeedbackButton>
                        </nav>
                        <Button
                            className={logoutButton}
                            type="button"
                            data-name="logoutButton"
                            variant={ButtonVariants.OUTLINED}
                            onClick={handleLogOutButtonClick}>
                            <Icon type="exit_to_app" className={logoutButtonIcon} />
                            {localize(i18n, 'trader.navigation.logOut')}
                        </Button>
                    </>
                );
            }}
        </Drawer>
    );
};

export default React.memo(DrawerNavigation);
