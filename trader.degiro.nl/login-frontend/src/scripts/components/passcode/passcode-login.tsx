import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, ErrorCodes} from 'frontend-core/dist/models/app-error';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import saveToBiometricKeychain from 'frontend-core/dist/platform/biometric-keychain/save-to-biometric-keychain';
import verifyInBiometricKeychain from 'frontend-core/dist/platform/biometric-keychain/verify-in-biometric-keychain';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import useJointAccountErrorPersons from '../../hooks/use-joint-account-error-persons';
import {PassCodeLoginParams, PassCodeLoginResponse} from '../../models/user';
import {resetPassCodeUrlEntry, Routes} from '../../navigation';
import loginByPassCode from '../../services/user/login-by-passcode';
import {AppApiContext, AppParamsContext, ConfigContext, I18nContext, UserContext} from '../app-component/app-context';
import FormError from '../form/form-error';
import Icon from '../icon';
import UserAccountPersonVerification from '../user-account-person-verification';
import usePasscodeForm, {PassCodeFormData} from './hooks/use-passcode-form';
import PassCodeIndicator from './passcode-indicator';
import PassCodeKeyboard from './passcode-keyboard';
import {
    form,
    page,
    passCodeRecoveryLink,
    passCodeRecoveryLinkLayout,
    userSelectControl,
    userSelectControlIcon,
    userSelectControlLabel,
    userSelectControlToggleIcon
} from './passcode.css';
import showBiometricAuthEnablingModal from './show-biometric-auth-enabling-modal';
import showBiometricAuthRequirementsModal from './show-biometric-auth-requirements-modal';

const {useState, useEffect, useContext} = React;
const PassCodeLogin: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const user = useContext(UserContext);
    const appParams = useContext(AppParamsContext);
    const {updateCurrentUser, openModal} = useContext(AppApiContext);
    const {username, deviceId, sessionId} = user;
    const [isBiometricAuthRequested, setBiometricAuthRequestState] = useState<boolean>(false);
    const [isBiometricAuthUsed, setBiometricAuthUsageState] = useState<boolean>(false);
    const sendFormDataRequest = (formData: PassCodeFormData) => {
        const loginParams: PassCodeLoginParams = {
            username: username as string,
            deviceId,
            queryParams: appParams,
            isBiometricLogin: isBiometricAuthUsed,
            ...formData
        };

        return loginByPassCode(config, loginParams).then((response: PassCodeLoginResponse) => {
            let promise: Promise<void> | undefined;

            if (isBiometricAuthRequested) {
                promise = showBiometricAuthEnablingModal({i18n, openModal}).then((isBiometricAuthConfirmed) => {
                    if (isBiometricAuthConfirmed) {
                        return saveToBiometricKeychain(username as string, formData.passCode);
                    }
                });
            }

            return (
                Promise.resolve(promise)
                    // proceed in case of failed Biometric Auth
                    .catch(logErrorRemotely)
                    .then(() => updateCurrentUser({...user, ...formData, ...response}))
            );
        });
    };
    const {
        formData: {passCode},
        isLoading,
        error,
        addPassCodeDigit,
        slicePassCodeRight,
        selectUserAccountPerson,
        isBiometricAuthEnabled,
        isBiometricAuthAvailable,
        hasJointAccountPersonNeededError,
        setPassCode,
        setBiometricAuthEnabled
    } = usePasscodeForm({user, sendFormDataRequest});
    const persons: UserAccountPerson[] = useJointAccountErrorPersons(error);
    const openBiometricAuth = (username: string) => {
        const setupBiometricAuthAfterPassCodeConfirmation = () => {
            setBiometricAuthRequestState(true);
            showBiometricAuthRequirementsModal({i18n, openModal});
        };

        if (!isBiometricAuthEnabled) {
            setupBiometricAuthAfterPassCodeConfirmation();
            return;
        }

        verifyInBiometricKeychain(username, localize(i18n, 'login.biometricAuth.verification.description', {username}))
            .then((passCode: string) => {
                setBiometricAuthUsageState(true);
                setPassCode(passCode);
            })
            .catch((error: Error | AppError) => {
                logErrorLocally(error);

                // [TRADER-1006]: if error happened during verification we need to store biometric credentials again
                setBiometricAuthEnabled(false);
                // [TRADER-1006]: ask the user for passCode again and store biometric credentials again
                setupBiometricAuthAfterPassCodeConfirmation();

                // https://github.com/sjhoeksma/cordova-plugin-keychain-touch-id#android-quirks
                // we do not log all errors to not spam Sentry
                if (isAppError(error) && error.code === ErrorCodes.ANDROID_KEYSTORE_KEY_PERMANENTLY_INVALIDATED) {
                    logErrorRemotely(error);
                }
            });
    };

    useGenericSubmitErrorModal({error});

    useEffect(() => {
        // reset previous values
        if (!isBiometricAuthEnabled) {
            setBiometricAuthUsageState(false);
            setPassCode('');
        }
    }, [isBiometricAuthEnabled]);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/passcode-login'});
    }, []);

    if (isLoading) {
        return <Spinner local={true} />;
    }

    if (hasJointAccountPersonNeededError) {
        return <UserAccountPersonVerification persons={persons} onPersonSelect={selectUserAccountPerson} />;
    }

    return (
        <div className={page}>
            <div className={form}>
                {error && <FormError error={new AppError({text: 'passCode.passCodeForm.errors.invalidPassCode'})} />}
                <Link to={Routes.USERS} className={userSelectControl}>
                    <Icon className={userSelectControlIcon} type="user_solid" />
                    <span className={userSelectControlLabel} data-field="username">
                        {username}
                    </span>
                    <Icon className={userSelectControlToggleIcon} type="caret-down_solid" />
                </Link>
                <PassCodeIndicator passCode={passCode} />
                <PassCodeKeyboard
                    passCode={passCode}
                    onBiometricAuthSelect={
                        isBiometricAuthAvailable && username ? openBiometricAuth.bind(null, username) : undefined
                    }
                    onDigitEnter={addPassCodeDigit}
                    onBackSpace={slicePassCodeRight}
                />
                <div className={passCodeRecoveryLinkLayout}>
                    <Link
                        className={passCodeRecoveryLink}
                        to={
                            username && sessionId
                                ? Routes.PASSCODE_RESET
                                : `${Routes.PASSWORD_LOGIN}?${resetPassCodeUrlEntry}`
                        }>
                        {localize(i18n, 'passCode.passCodeForm.forgotPassCode')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PassCodeLogin);
