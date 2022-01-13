import Input from 'frontend-core/dist/components/ui-onboarding/input';
import PasswordInput from 'frontend-core/dist/components/ui-onboarding/input/password-input';
import {page, pageTitle} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import {isKey} from 'frontend-core/dist/platform/keyboard';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isJointAccountPersonNeededError from 'frontend-core/dist/services/app-error/is-joint-account-person-needed-error';
import isOtpRequiredError from 'frontend-core/dist/services/app-error/is-otp-required-error';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import localize from 'frontend-core/dist/services/i18n/localize';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import useJointAccountErrorPersons from '../../hooks/use-joint-account-error-persons';
import {PasswordLoginParams, PasswordLoginResponse} from '../../models/user';
import {resetPassCodeUrlEntry, resetUserUrlEntry, Routes} from '../../navigation';
import loginByPassword from '../../services/user/login-by-password';
import normalizeUserName from '../../services/user/normalize-username';
import validateLoginData from '../../services/user/validate-login-data';
import {
    AppApiContext,
    AppParamsContext,
    ConfigContext,
    DeviceInfoContext,
    I18nContext,
    UserContext
} from '../app-component/app-context';
import AppLinks from '../app-links/index';
import FormError from '../form/form-error';
import {formControl, formLine, formSubmitButton} from '../form/form.css';
import OtpVerification from '../otp-verification';
import UserAccountPersonVerification from '../user-account-person-verification/index';
import {
    baseForm,
    buttonError,
    errorPlaceholder,
    form as formClassName,
    passwordFieldWrapper,
    passwordResetLink
} from './password-login.css';

type FormData = Omit<PasswordLoginParams, 'queryParams' | 'deviceId'>;

const {useState, useEffect, useCallback, useContext} = React;
const PasswordLogin: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const user = useContext(UserContext);
    const deviceInfo = useContext(DeviceInfoContext);
    const appParams = useContext(AppParamsContext);
    const {updateCurrentUser, removeUser} = useContext(AppApiContext);
    const location = useLocation();
    const [error, setError] = useState<Error | AppError | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({username: '', password: ''});
    const persons: UserAccountPerson[] = useJointAccountErrorPersons(error);
    const sendFormData = (formData: FormData) => {
        formData = {...formData, username: normalizeUserName(formData.username)};

        const error: AppError | undefined = validateLoginData(formData);

        if (error) {
            setError(error);
            return;
        }

        setFormData(formData);
        setIsLoading(true);

        loginByPassword(config, i18n, {
            ...formData,
            queryParams: appParams,
            deviceId: deviceInfo.uuid
        })
            // `formData` values should override props like `isPassCodeEnabled` (it can be reset to false),
            // `username`, etc.
            .then((response: PasswordLoginResponse) => updateCurrentUser({...response, ...formData}))
            .catch((error: Error | AppError) => {
                setIsLoading(false);
                setError(error);
            });
    };
    const selectUserAccountPerson = useCallback((userAccountPerson: UserAccountPerson) => {
        setFormData((formData) => ({...formData, personId: userAccountPerson.id}));
    }, []);
    const onFormKeyUp = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (!isKey(event, 'Enter')) {
            setError(undefined);
        }
    }, []);
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            deactivateActiveElement();
            sendFormData({...formData, ...getFormData(event.currentTarget)});
        },
        [formData, sendFormData]
    );

    useEffect(() => {
        const {search} = location;
        const {username} = user;
        const isUserReset: boolean = search.includes(resetUserUrlEntry);
        const isPassCodeReset: boolean = search.includes(resetPassCodeUrlEntry);
        const formDataUpdate: Partial<FormData> = {};

        if (isUserReset || isPassCodeReset) {
            // user should set his passCode again
            formDataUpdate.isPassCodeEnabled = false;

            // remove user from the users list and prefill his username
            if (isUserReset && username) {
                formDataUpdate.username = username;
                removeUser(user);
            }
        }

        // exclude previously set (by previous `location.search`) flag `isPassCodeEnabled`
        setFormData(({isPassCodeEnabled, ...formData}) => ({...formData, ...formDataUpdate}));
    }, [location.search]);

    useGenericSubmitErrorModal({error});

    useEffect(() => trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/password-login'}), []);

    useEffect(() => {
        if (formData.personId !== undefined) {
            sendFormData(formData);
        }
    }, [formData.personId]);

    if (error && isJointAccountPersonNeededError(error)) {
        return <UserAccountPersonVerification persons={persons} onPersonSelect={selectUserAccountPerson} />;
    }

    if (error && isOtpRequiredError(error)) {
        return <OtpVerification user={{...user, ...formData}} />;
    }

    const isApp: boolean = isWebViewApp();

    return (
        <div className={page}>
            <h2 className={pageTitle} data-name="loginFormTitle" key="loginFormHeader">
                {localize(i18n, 'login.loginForm.header')}
            </h2>
            <form
                action="#"
                method="POST"
                id="loginForm"
                name="loginForm"
                onKeyUp={onFormKeyUp}
                onSubmit={isLoading ? stopEvent : onFormSubmit}
                className={`${baseForm} ${formClassName}`}>
                <div className={errorPlaceholder}>{error && <FormError error={error} />}</div>
                <Input
                    id="username"
                    name="username"
                    required={true}
                    autoFocus={true}
                    i18n={i18n}
                    defaultValue={formData.username}
                    autoComplete="username"
                    error={error && new AppError({...(error as AppError), text: ''})}
                    className={formControl}
                    label={localize(i18n, 'login.loginForm.username')}
                    placeholder={localize(i18n, 'login.loginForm.username')}
                />
                <div className={passwordFieldWrapper}>
                    <PasswordInput
                        id="password"
                        name="password"
                        required={true}
                        i18n={i18n}
                        defaultValue={formData.password}
                        autoComplete="current-password"
                        error={error && new AppError({...(error as AppError), text: ''})}
                        className={formControl}
                        label={localize(i18n, 'login.loginForm.password')}
                        placeholder={localize(i18n, 'login.loginForm.password')}
                    />
                    <Link to={Routes.PASSWORD_RESET} className={passwordResetLink}>
                        {localize(i18n, 'login.loginForm.forgotLoginDetails')}
                    </Link>
                </div>
                <div className={formLine}>
                    <Button
                        type="submit"
                        name="loginButtonUniversal"
                        className={`
                            ${formSubmitButton}
                            ${error ? buttonError : ''}
                        `}>
                        {localize(i18n, 'login.loginForm.loginAction')} {isLoading && '...'}
                    </Button>
                </div>
                {!isApp && <AppLinks />}
            </form>
        </div>
    );
};

export default React.memo(PasswordLogin);
