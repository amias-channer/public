import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {pageTitle} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Icon from '../icon/index';
import {
    description,
    layout,
    loginButton,
    titleIcon,
    titleIconWrapper,
    titleSubIcon
} from './user-activation-result.css';

interface Props {
    onLogin(): void;
}

const {useContext} = React;
const UserActivationResult: React.FunctionComponent<Props> = ({onLogin}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={layout} data-name="userActivationResult">
            <div className={titleIconWrapper}>
                <Icon className={titleIcon} type="envelope_solid" />
                <Icon className={titleSubIcon} type="check-circle_solid" />
            </div>
            <h2 className={pageTitle}>{localize(i18n, 'login.userActivationResult.title')}</h2>
            <InnerHtml className={description}>{localize(i18n, 'login.userActivationResult.description')}</InnerHtml>
            <Button data-name="loginButton" className={loginButton} onClick={onLogin}>
                {localize(i18n, 'login.loginForm.loginAction')}
            </Button>
        </div>
    );
};

export default React.memo(UserActivationResult);
