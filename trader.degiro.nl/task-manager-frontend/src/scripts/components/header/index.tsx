import OnboardingHeader from 'frontend-core/dist/components/ui-onboarding/header';
import {rightActionLink} from 'frontend-core/dist/components/ui-onboarding/header/header.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {User} from 'frontend-core/dist/models/user';
import localize from 'frontend-core/dist/services/i18n/localize';
import logout from 'frontend-core/dist/services/user/logout';
import redirectToLoginPage from 'frontend-core/dist/services/user/redirect-to-login-page';
import * as React from 'react';
import {TasksProgressInformation} from '../../models/tasks-progress';
import {ConfigContext, I18nContext, MainClientContext} from '../app-component/app-context';

type UserWithAssetManagerData = User & Required<Pick<User, 'logo' | 'displayName'>>;
interface Props {
    tasksProgressInformation: TasksProgressInformation;
}

const {useCallback, useContext} = React;
const isAssetManagerWithData = (user: User): user is UserWithAssetManagerData => {
    return user.isAssetManager === true && typeof user.logo === 'string';
};
const Header: React.FunctionComponent<Props> = ({tasksProgressInformation}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const {loginUrl} = config;
    // const phoneLabel: string = getPhoneLabel(i18n);
    const handleLogout = useCallback(() => {
        // redirect to the login page even if we got the error
        logout(config)
            .catch(logErrorLocally)
            .then(() => redirectToLoginPage(config))
            .catch(logErrorLocally);
    }, [config]);

    return (
        <OnboardingHeader
            assetManager={
                isAssetManagerWithData(mainClient)
                    ? {logoUrl: mainClient.logo, name: mainClient.displayName}
                    : undefined
            }
            // TODO: [REFIT-7167] uncomment when allowed
            // centerContent={[
            //     <span className={helpDeskHint} key="helpDeskHint">
            //         {localize(i18n, 'taskManager.header.helpDeskHint')}
            //     </span>,
            //     <a key="phoneLabel" href={getPhoneHref(store)} className={link} aria-label={phoneLabel}>
            //         <Icon className={phoneNumberIcon} type="phone_solid" />
            //         <span className={phoneNumber}>{phoneLabel}</span>
            //     </a>
            // ]}
            rightAction={
                loginUrl && (
                    <a href={loginUrl} className={rightActionLink} onClick={handleLogout}>
                        {tasksProgressInformation.currentTask
                            ? localize(i18n, 'taskManager.task.finishLater')
                            : localize(i18n, 'taskManager.header.logOut')}
                    </a>
                )
            }
        />
    );
};

export default React.memo(Header);
