import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import deleteFromBiometricKeychain from 'frontend-core/dist/platform/biometric-keychain/delete-from-biometric-keychain';
import saveToBiometricKeychain from 'frontend-core/dist/platform/biometric-keychain/save-to-biometric-keychain';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import useJointAccountErrorPersons from '../../hooks/use-joint-account-error-persons';
import setPassCode from '../../services/user/set-passcode';
import {AppApiContext, ConfigContext, I18nContext, UserContext} from '../app-component/app-context';
import FormError from '../form/form-error';
import UserAccountPersonVerification from '../user-account-person-verification';
import usePasscodeForm, {PassCodeFormData} from './hooks/use-passcode-form';
import PassCodeIndicator from './passcode-indicator';
import PassCodeKeyboard from './passcode-keyboard';
import {form, page, pageTitle} from './passcode.css';
import showBiometricAuthEnablingModal from './show-biometric-auth-enabling-modal';

const {useEffect, useContext} = React;
const PassCodeReset: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const user = useContext(UserContext);
    const {updateCurrentUser, openModal} = useContext(AppApiContext);
    const {username} = user;
    const sendFormDataRequest = (formData: PassCodeFormData) => {
        return setPassCode(config, user, formData)
            .then(() => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                return isBiometricAuthAvailable ? showBiometricAuthEnablingModal({i18n, openModal}) : undefined;
            })
            .then((isBiometricAuthConfirmed: boolean | undefined) => {
                if (isBiometricAuthConfirmed && username) {
                    return saveToBiometricKeychain(username, formData.passCode).catch(logErrorRemotely);
                }
            })
            .then(() => updateCurrentUser({...user, ...formData}));
    };
    const {
        formData: {passCode},
        isLoading,
        error,
        addPassCodeDigit,
        slicePassCodeRight,
        selectUserAccountPerson,
        isBiometricAuthAvailable,
        hasJointAccountPersonNeededError
    } = usePasscodeForm({user, sendFormDataRequest});
    const persons: UserAccountPerson[] = useJointAccountErrorPersons(error);

    useGenericSubmitErrorModal({error});

    useEffect(() => {
        // delete stored passCode from KeyChain
        if (username) {
            deleteFromBiometricKeychain(username).catch(logErrorRemotely);
        }
    }, [username]);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/passcode-reset'});
    }, []);

    if (isLoading) {
        return <Spinner local={true} />;
    }

    if (hasJointAccountPersonNeededError) {
        return <UserAccountPersonVerification persons={persons} onPersonSelect={selectUserAccountPerson} />;
    }

    return (
        <div className={page}>
            <h2 className={pageTitle} data-name="passCodeFormTitle">
                {localize(i18n, 'passCode.passCodeResetForm.header')}
            </h2>
            <div className={form}>
                {error && <FormError error={new AppError({text: 'passCode.passCodeForm.errors.invalidPassCode'})} />}
                <PassCodeIndicator passCode={passCode} />
                <PassCodeKeyboard
                    passCode={passCode}
                    onDigitEnter={addPassCodeDigit}
                    onBackSpace={slicePassCodeRight}
                />
            </div>
        </div>
    );
};

export default React.memo(PassCodeReset);
