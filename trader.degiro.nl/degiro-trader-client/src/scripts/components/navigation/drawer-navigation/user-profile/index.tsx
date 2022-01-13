import localize from 'frontend-core/dist/services/i18n/localize';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Routes} from '../../../../navigation';
import {CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import OpenedTasksCount from '../../../opened-tasks-count';
import ProfileAvatar from '../../../profile/avatar';
import {nbsp} from '../../../value';
import {
    controlItem,
    profileControlItem,
    profileControlMainContent,
    profileControlSubTitle,
    profileControlTitle,
    tasksCountBadge
} from './user-profile.css';
import {nextIcon} from '../drawer-navigation.css';

const {useContext} = React;
const UserProfile: React.FunctionComponent = () => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const {clientRoleTranslation, displayName, username} = currentClient;

    return (
        <Link to={Routes.PROFILE} className={`${controlItem} ${profileControlItem}`}>
            <ProfileAvatar />
            <OpenedTasksCount className={tasksCountBadge} />
            <div className={profileControlMainContent}>
                <div data-name="clientDisplayName" className={profileControlTitle}>
                    {displayName}
                </div>
                <div className={profileControlSubTitle}>
                    <span data-name="clientUserName">{username}</span>
                    {clientRoleTranslation && (
                        <span data-name="clientRole">
                            {nbsp}–{nbsp}
                            {localize(i18n, clientRoleTranslation)}
                        </span>
                    )}
                </div>
            </div>
            <Icon type="keyboard_arrow_right" className={nextIcon} />
        </Link>
    );
};

export default React.memo(UserProfile);
