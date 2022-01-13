import Input from 'frontend-core/dist/components/ui-onboarding/input';
import {page, pageTitle} from 'frontend-core/dist/components/ui-onboarding/page.css';
import Button from 'frontend-core/dist/components/ui-trader3/button';
import TextButton from 'frontend-core/dist/components/ui-trader3/button/text-button';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner/index';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import {isKey} from 'frontend-core/dist/platform/keyboard';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import getFormData from 'frontend-core/dist/services/form/get-form-data';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import {PasswordResetData} from '../../models/user';
import {Routes} from '../../navigation';
import resetPassword from '../../services/user/reset-password';
import validatePasswordReset from '../../services/user/validate-password-reset';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import FormError from '../form/form-error';
import {form as formStyle, formBottomHints, formControl, formLine, formSubmitButton} from '../form/form.css';
import Icon from '../icon';

const {useState, useCallback, useEffect, useContext} = React;
const PasswordReset: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {goToPasswordLogin, openModal} = useContext(AppApiContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | AppError | undefined>(undefined);
    const [formData, setFormData] = useState<PasswordResetData>({username: '', email: ''});
    const onFormKeyUp = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (!isKey(event, 'Enter')) {
            setError(undefined);
        }
    }, []);
    const showSuccessResult = () => {
        openModal({
            icon: <Icon type="envelope_solid" scale={2} />,
            content: localize(i18n, 'passwordReset.passwordResetForm.emailSent'),
            actions: [
                {
                    component: Link,
                    props: {to: Routes.PASSWORD_LOGIN},
                    content: localize(i18n, 'passwordReset.passwordResetForm.backToLogin')
                }
            ]
        });
    };
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            deactivateActiveElement();

            const newFormData: PasswordResetData = {...formData, ...getFormData(event.currentTarget)};
            const error: AppError | undefined = validatePasswordReset(newFormData);

            if (error) {
                setError(error);
                return;
            }

            setFormData(newFormData);
            setError(undefined);
            setIsLoading(true);

            resetPassword(config, i18n, newFormData)
                .then(() => {
                    setIsLoading(false);
                    showSuccessResult();
                })
                .catch((error: Error | AppError) => {
                    setIsLoading(false);
                    setError(error);
                });
        },
        [formData]
    );

    useGenericSubmitErrorModal({error});

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/password-reset'});
    }, []);

    const {username: usernameError, email: emailError} = (error && getFieldErrors(error)) || {};

    return (
        <div className={page}>
            <h2 className={pageTitle}>{localize(i18n, 'passwordReset.passwordResetForm.header')}</h2>
            {isLoading ? (
                <Spinner local={true} />
            ) : (
                <form
                    action="#"
                    method="POST"
                    autoComplete="off"
                    onSubmit={onFormSubmit}
                    onKeyUp={onFormKeyUp}
                    className={formStyle}>
                    {error && <FormError error={error} />}
                    <Input
                        type="text"
                        name="username"
                        required={true}
                        autoFocus={true}
                        i18n={i18n}
                        error={usernameError && new AppError({...usernameError, text: ''})}
                        defaultValue={formData.username}
                        className={formControl}
                        label={localize(i18n, 'passwordReset.passwordResetForm.username')}
                        placeholder={localize(i18n, 'passwordReset.passwordResetForm.username')}
                    />
                    <Input
                        type="email"
                        name="email"
                        required={true}
                        i18n={i18n}
                        error={emailError && new AppError({...emailError, text: ''})}
                        defaultValue={formData.email}
                        className={formControl}
                        label={localize(i18n, 'passwordReset.passwordResetForm.email')}
                        placeholder={localize(i18n, 'passwordReset.passwordResetForm.email')}
                    />
                    <div className={formLine}>
                        <Button type="submit" className={formSubmitButton}>
                            {localize(i18n, 'passwordReset.passwordResetForm.confirmAction')}
                        </Button>
                    </div>
                    <div className={formBottomHints}>
                        <TextButton onClick={goToPasswordLogin} leftIcon={<Icon type="chevron-left_regular" />}>
                            {localize(i18n, 'passwordReset.passwordResetForm.backToLogin')}
                        </TextButton>
                    </div>
                </form>
            )}
        </div>
    );
};

export default React.memo(PasswordReset);
