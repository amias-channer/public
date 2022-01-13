import useDeviceBackButton from 'frontend-core/dist/hooks/use-device-back-button';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {UserAccountPerson} from 'frontend-core/dist/models/user';
import isBiometricKeychainAvailable from 'frontend-core/dist/platform/biometric-keychain/is-biometric-keychain-available';
import isSavedInBiometricKeychain from 'frontend-core/dist/platform/biometric-keychain/is-saved-in-biometric-keychain';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import {getKeyString, isDigitKey, isKey} from 'frontend-core/dist/platform/keyboard';
import isJointAccountPersonNeededError from 'frontend-core/dist/services/app-error/is-joint-account-person-needed-error';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {useContext, useEffect, useState} from 'react';
import {passCodeLength, PassCodeLoginParams, User} from '../../../models/user';
import shouldResetUserByError from '../../../services/user/should-reset-user-by-error';
import {AppApiContext} from '../../app-component/app-context';

export type PassCodeFormData = Pick<PassCodeLoginParams, 'passCode' | 'personId'>;

interface Props {
    user: User;
    sendFormDataRequest(formData: PassCodeFormData): Promise<void>;
}

interface State {
    formData: PassCodeFormData;
    isLoading: boolean;
    error: Error | AppError | undefined;
    isBiometricAuthAvailable: boolean;
    isBiometricAuthEnabled: boolean;
    hasJointAccountPersonNeededError: boolean;
    setBiometricAuthEnabled(isEnabled: boolean): void;
    selectUserAccountPerson(userAccountPerson: UserAccountPerson): void;
    addPassCodeDigit(digit: string): void;
    slicePassCodeRight(): void;
    setPassCode(passCode: string): void;
}

const noop = () => undefined;

export default function usePasscodeForm({user, sendFormDataRequest}: Props): State {
    const {username} = user;
    const {goToUserResetLogin} = useContext(AppApiContext);
    const [formData, setFormData] = useState<PassCodeFormData>({passCode: ''});
    const [error, setError] = useState<Error | AppError | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBiometricAuthAvailable, setBiometricAuthAvailable] = useState<boolean>(false);
    const [isBiometricAuthEnabled, setBiometricAuthEnabled] = useState<boolean>(false);
    const hasJointAccountPersonNeededError: boolean = Boolean(error && isJointAccountPersonNeededError(error));
    const setPassCode = (passCode: string) => setFormData((formData) => ({...formData, passCode}));
    const addPassCodeDigit = (digit: string) => {
        setFormData((formData) => ({...formData, passCode: formData.passCode + digit}));
    };
    const slicePassCodeRight = () => {
        setFormData((formData) => ({...formData, passCode: formData.passCode.slice(0, -1)}));
    };
    const submitFormData = () => {
        deactivateActiveElement();
        setIsLoading(true);
        setError(undefined);

        sendFormDataRequest(formData).catch((error: Error | AppError) => {
            if (shouldResetUserByError(error)) {
                return goToUserResetLogin();
            }

            // clear `passCode` after the error except the one after which we need to select an account person
            if (!isJointAccountPersonNeededError(error)) {
                setFormData((formData) => ({...formData, passCode: ''}));
            }

            setError(error);
            setIsLoading(false);
        });
    };
    const selectUserAccountPerson = (userAccountPerson: UserAccountPerson) => {
        setFormData((formData) => ({...formData, personId: userAccountPerson.id}));
    };

    // [WF-514]: prevent history "Back" action for the PassCode screen
    useDeviceBackButton(noop);

    useEffect(() => {
        const isPassCodeValid: boolean = formData.passCode.length === passCodeLength;
        const isPersonSelected: boolean = formData.personId !== undefined;

        if (isPassCodeValid || isPersonSelected) {
            submitFormData();
        }
    }, [formData]);

    useEffect(() => {
        const onGlobalKeyUp = (event: KeyboardEvent) => {
            if (isKey(event, 'Backspace')) {
                return slicePassCodeRight();
            }

            if (isDigitKey(event)) {
                addPassCodeDigit(getKeyString(event));
            }
        };

        document.addEventListener('keyup', onGlobalKeyUp, false);

        return () => document.removeEventListener('keyup', onGlobalKeyUp, false);
    }, []);

    useEffect(() => {
        // reset previous value
        setBiometricAuthEnabled(false);

        if (!username) {
            return;
        }

        const biometricAuthEnabledStatusPromise = createCancellablePromise(isSavedInBiometricKeychain(username));

        biometricAuthEnabledStatusPromise.promise.then(() => setBiometricAuthEnabled(true)).catch(logErrorLocally);

        return biometricAuthEnabledStatusPromise.cancel;
    }, [username]);

    useEffect(() => {
        const biometricAuthAvailableStatusPromise = createCancellablePromise(isBiometricKeychainAvailable());

        biometricAuthAvailableStatusPromise.promise.then(() => setBiometricAuthAvailable(true)).catch(logErrorLocally);

        return biometricAuthAvailableStatusPromise.cancel;
    }, []);

    return {
        formData,
        isLoading,
        error,
        isBiometricAuthAvailable,
        isBiometricAuthEnabled,
        hasJointAccountPersonNeededError,
        setBiometricAuthEnabled,
        setPassCode,
        addPassCodeDigit,
        slicePassCodeRight,
        selectUserAccountPerson
    };
}
