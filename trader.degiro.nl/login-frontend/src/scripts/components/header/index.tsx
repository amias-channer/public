import {rightActionLink, rightActionTitle} from 'frontend-core/dist/components/ui-onboarding/header/header.css';
import OnboardingHeader from 'frontend-core/dist/components/ui-onboarding/header/index';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import getAssetManagerLogoUrl from 'frontend-core/dist/services/user/get-asset-manager-logo-url';
import * as React from 'react';
import getRegistrationUrl from '../../services/config/get-registration-url';
import {ConfigContext, I18nContext} from '../app-component/app-context';

interface Props {
    showRegistrationLink: boolean;
}

const {useCallback, useContext} = React;
const Header: React.FunctionComponent<Props> = ({showRegistrationLink}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {amCode} = config;
    const onRegistrationLinkClick = useCallback(() => trackAnalytics(TrackerEventTypes.CREATE_ACCOUNT, {}), []);

    return (
        <OnboardingHeader
            assetManager={amCode ? {logoUrl: getAssetManagerLogoUrl(amCode), name: amCode} : undefined}
            rightAction={
                showRegistrationLink && (
                    <div>
                        <span className={rightActionTitle}>{localize(i18n, 'login.loginForm.noAccount')}</span>
                        <a
                            data-name="registrationLink"
                            className={rightActionLink}
                            onClick={onRegistrationLinkClick}
                            href={getRegistrationUrl(config, i18n)}>
                            {localize(i18n, 'login.loginForm.createNewAccount')}
                        </a>
                    </div>
                )
            }
        />
    );
};

export default React.memo(Header);
