import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import feedbackIconUrl from '../../../../../images/svg/feedback.svg';
import referralIconUrl from '../../../../../images/svg/referral.svg';
import useProfileItems from '../../../../hooks/use-profile-items';
import {Routes} from '../../../../navigation';
import {CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import FeedbackButton from '../../../feedback/button';
import BlockMenu, {BlockMenuProps} from '../../../menu/block-menu';
import BlockMenuDivider from '../../../menu/block-menu/block-menu-divider';
import BlockMenuItemLayout from '../../../menu/block-menu/block-menu-item-layout';
import OpenedTasksCount from '../../../opened-tasks-count';
import ProfileAvatar from '../../../profile/avatar';
import InvitationLink from '../../../profile/invitation/link';
import {nbsp} from '../../../value';
import {
    activeNavigationItem,
    navigationItemToggleIcon,
    navigationItem,
    openedNavigationItem,
    profileAvatar,
    tasksCountBadge
} from '../side-navigation.css';
import isProfileNavigationItemActive from './is-profile-navigation-item-active';
import {itemMeta} from './profile-menu.css';

const {useCallback, useContext} = React;
const ProfileMenu = () => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const profileItems = useProfileItems();
    const isActive = isProfileNavigationItemActive(location);
    const {displayName, username} = currentClient;
    const title = localize(i18n, 'trader.navigation.profile');
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <Link
                to={Routes.PROFILE}
                data-active={isActive}
                aria-label={title}
                className={`${navigationItem} ${isActive ? activeNavigationItem : ''} ${
                    isOpened ? openedNavigationItem : ''
                }`}
                onClick={deactivateActiveElement}
                onFocus={open}
                onMouseLeave={close}
                onMouseOver={open}>
                <OpenedTasksCount className={tasksCountBadge} />
                <ProfileAvatar className={profileAvatar} />
                <Icon className={navigationItemToggleIcon} type="arrow_drop_down" />
            </Link>
        ),
        [isActive, title]
    );

    return (
        <BlockMenu renderTarget={renderTarget} verticalPosition="inside-start" title={displayName} subTitle={username}>
            <nav aria-label={title}>
                <ul>
                    {profileItems.map(({id, disabled, to, iconUrl, badge, title, subTitle, meta}) => {
                        const content = (
                            <BlockMenuItemLayout
                                iconUrl={iconUrl}
                                badge={badge}
                                title={
                                    <>
                                        {title}
                                        {meta && `${nbsp}–${nbsp}`}
                                        {meta && <span className={itemMeta}>{meta}</span>}
                                    </>
                                }
                                description={subTitle}
                            />
                        );

                        return <li key={id}>{disabled ? content : <Link to={to}>{content}</Link>}</li>;
                    })}
                </ul>
                <BlockMenuDivider />
                <ul>
                    <li>
                        <InvitationLink>
                            <BlockMenuItemLayout
                                iconUrl={referralIconUrl}
                                title={localize(i18n, 'trader.profile.invitation.title')}
                                description={localize(i18n, 'trader.profile.invitation.description')}
                            />
                        </InvitationLink>
                    </li>
                    <li>
                        <FeedbackButton>
                            <BlockMenuItemLayout
                                iconUrl={feedbackIconUrl}
                                title={localize(i18n, 'trader.feedback.title')}
                                description={localize(i18n, 'trader.feedback.subTitle')}
                            />
                        </FeedbackButton>
                    </li>
                </ul>
            </nav>
        </BlockMenu>
    );
};

export default ProfileMenu;
