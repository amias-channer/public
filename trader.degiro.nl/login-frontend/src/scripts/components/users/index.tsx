import {page} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {User} from '../../models/user';
import normalizeUserName from '../../services/user/normalize-username';
import {AppApiContext, I18nContext, UsersContext} from '../app-component/app-context';
import {formLine, formSubmitButton} from '../form/form.css';
import {form, userActionsItem, username as usernameClassName, usersListItem} from './users.css';

const {useEffect, useContext} = React;
const Users: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const users = useContext(UsersContext);
    const {addUser, updateCurrentUser, removeUser} = useContext(AppApiContext);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/users'});
    }, []);

    const displayedUsersNames: Set<string> = new Set();

    return (
        <div className={page}>
            <div className={form} data-name="usersList">
                {users.map((user: User) => {
                    const {username} = user;
                    // [WF-2071] list should be case-insensitive for the username
                    const usernameKey: string | undefined = username && normalizeUserName(username);

                    if (usernameKey && !displayedUsersNames.has(usernameKey)) {
                        displayedUsersNames.add(usernameKey);

                        return (
                            <div className={usersListItem} key={usernameKey}>
                                <div data-field="username" data-id={username} className={usernameClassName}>
                                    {username}
                                </div>
                                <button
                                    type="button"
                                    className={userActionsItem}
                                    data-id={username}
                                    name="userSelectButton"
                                    onClick={updateCurrentUser.bind(null, user, undefined)}>
                                    {localize(i18n, 'login.users.select')}
                                </button>
                                <button
                                    type="button"
                                    className={userActionsItem}
                                    data-id={username}
                                    name="userRemoveButton"
                                    onClick={removeUser.bind(null, user, {selectNextUser: true})}>
                                    {localize(i18n, 'login.users.remove')}
                                </button>
                            </div>
                        );
                    }

                    return null;
                })}
                <div className={formLine}>
                    <Button type="button" name="newUserButton" onClick={addUser} className={formSubmitButton}>
                        {localize(i18n, 'login.users.add')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Users);
