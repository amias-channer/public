import Input from 'frontend-core/dist/components/ui-onboarding/input';
import {page, pageTitle} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner/index';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, ErrorCodes} from 'frontend-core/dist/models/app-error';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import {User} from '../../models/user';
import checkOtp from '../../services/otp/check-otp';
import validateOtpData from '../../services/otp/validate-otp-data';
import {
    AppApiContext,
    AppParamsContext,
    ConfigContext,
    DeviceInfoContext,
    I18nContext
} from '../app-component/app-context';
import FormError from '../form/form-error';
import {form as formStyle, formControl, formLine, formSubmitButton} from '../form/form.css';
import {formControlInput} from './otp-verification.css';

interface Props {
    user: User;
}

const {useState, useEffect, useLayoutEffect, useRef, useCallback, useContext} = React;
const OtpVerification: React.FunctionComponent<Props> = ({user}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const deviceInfo = useContext(DeviceInfoContext);
    const appParams = useContext(AppParamsContext);
    const {updateCurrentUser} = useContext(AppApiContext);
    const formElementRef = useRef<HTMLFormElement | null>(null);
    const [error, setError] = useState<AppError | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [oneTimePassword, setOneTimePassword] = useState<string>('');
    const onOtpInputChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const oneTimePassword: string = event.currentTarget.value;

        setOneTimePassword(oneTimePassword.replace(/\s+/g, ''));
        setError(undefined);
    }, []);
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            deactivateActiveElement();

            const error: AppError | undefined = validateOtpData({oneTimePassword});

            if (error) {
                setError(error);
                setOneTimePassword('');
                return;
            }

            setIsLoading(true);
            setError(undefined);

            checkOtp(config, {
                username: user.username,
                password: user.password,
                personId: user.personId,
                queryParams: appParams,
                deviceId: deviceInfo.uuid,
                oneTimePassword
            })
                .then((response: Partial<User>) => updateCurrentUser({...user, ...response}))
                .catch((error: AppError) => {
                    const isFormDataError: boolean = error.code === ErrorCodes.BAD_CREDENTIALS;

                    // [WF-2118]: skip general error handling for OTP validation error
                    if (isFormDataError) {
                        setOneTimePassword('');
                    }

                    setError(error);
                    setIsLoading(false);
                });
        },
        [oneTimePassword]
    );

    useGenericSubmitErrorModal({error});

    useLayoutEffect(() => {
        const otpInput = formElementRef.current?.querySelector<HTMLInputElement>('[name="oneTimePassword"]');

        if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
        }
    }, []);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/otp-verification'});
    }, []);

    return (
        <div className={page}>
            <h2 className={pageTitle}>{localize(i18n, 'twoStepVerification.twoStepVerificationForm.header')}</h2>
            {isLoading ? (
                <Spinner local={true} />
            ) : (
                <form
                    action="#"
                    method="POST"
                    autoComplete="off"
                    onSubmit={onFormSubmit}
                    ref={formElementRef}
                    className={formStyle}>
                    {error && (
                        <FormError
                            error={
                                new AppError({
                                    text: 'twoStepVerification.twoVerificationForm.errors.invalidOneTimePassword'
                                })
                            }
                        />
                    )}
                    <Input
                        type="tel"
                        name="oneTimePassword"
                        autoComplete="off"
                        i18n={i18n}
                        required={true}
                        onChange={onOtpInputChange}
                        error={isAppError(error) ? new AppError({...error, text: ''}) : undefined}
                        value={oneTimePassword}
                        className={formControl}
                        fieldClassName={formControlInput}
                        maxLength={7}
                        placeholder="012345"
                    />
                    <div className={formLine}>
                        <Button type="submit" className={formSubmitButton}>
                            {localize(i18n, 'twoStepVerification.twoVerificationForm.twoVerificationAction')}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default React.memo(OtpVerification);
