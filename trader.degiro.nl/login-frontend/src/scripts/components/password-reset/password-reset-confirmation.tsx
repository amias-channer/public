import PasswordInput from 'frontend-core/dist/components/ui-onboarding/input/password-input';
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
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import useGenericSubmitErrorModal from '../../hooks/use-generic-submit-error-modal';
import {PasswordResetConfirmationData} from '../../models/user';
import {Routes} from '../../navigation';
import confirmPasswordReset from '../../services/user/confirm-password-reset';
import validatePasswordResetConfirmation from '../../services/user/validate-password-reset-confirmation';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import FormError from '../form/form-error';
import {form as formStyle, formBottomHints, formControl, formLine, formSubmitButton} from '../form/form.css';
import Icon from '../icon/index';

const {useState, useCallback, useEffect, useContext} = React;
const PasswordResetConfirmation: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {goToPasswordLogin, openModal} = useContext(AppApiContext);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | AppError | undefined>(undefined);
    const [formData, setFormData] = useState<PasswordResetConfirmationData>({
        newPassword: '',
        newPasswordConfirmation: ''
    });
    const onFormKeyUp = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (!isKey(event, 'Enter')) {
            setError(undefined);
        }
    }, []);
    const showSuccessResult = () => {
        openModal({
            icon: <Icon type="check_solid" scale={2} />,
            content: localize(i18n, 'passwordReset.passwordResetForm.passwordResetSuccess'),
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

            const newFormData: PasswordResetConfirmationData = {...formData, ...getFormData(event.currentTarget)};
            const error: AppError | undefined = validatePasswordResetConfirmation(newFormData);

            if (error) {
                setError(error);
                return;
            }

            setFormData(newFormData);
            setError(undefined);
            setIsLoading(true);

            const {activationCode, username} = parseUrlSearchParams(location.search);

            confirmPasswordReset(config, i18n, {...newFormData, activationCode, username})
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
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: '/login/password-reset-confirmation'});
    }, []);

    const {newPassword: newPasswordError, newPasswordConfirmation: newPasswordConfirmationError} =
        (error && getFieldErrors(error)) || {};

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
                    <PasswordInput
                        name="newPassword"
                        autoComplete="new-password"
                        required={true}
                        autoFocus={true}
                        i18n={i18n}
                        error={newPasswordError && new AppError({...newPasswordError, text: ''})}
                        defaultValue={formData && formData.newPassword}
                        className={formControl}
                        label={localize(i18n, 'passwordReset.passwordResetForm.newPassword')}
                        placeholder={localize(i18n, 'passwordReset.passwordResetForm.newPassword')}
                    />
                    <PasswordInput
                        name="newPasswordConfirmation"
                        autoComplete="new-password"
                        required={true}
                        i18n={i18n}
                        error={
                            newPasswordConfirmationError && new AppError({...newPasswordConfirmationError, text: ''})
                        }
                        defaultValue={formData && formData.newPasswordConfirmation}
                        className={formControl}
                        label={localize(i18n, 'passwordReset.passwordResetForm.newPasswordConfirmation')}
                        placeholder={localize(i18n, 'passwordReset.passwordResetForm.newPasswordConfirmation')}
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

export default React.memo(PasswordResetConfirmation);
