import {fieldError, formLine} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import getDisabledAutofillAttrs from 'frontend-core/dist/components/ui-trader4/form/get-disabled-autofill-attrs';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {AppError, ErrorCodes, FieldErrors} from 'frontend-core/dist/models/app-error';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import ExternalHtmlContent from '../../external-html-content/index';
import {buttons, cancelButton, confirmButton} from '../../modal/modal.css';
import {NewFeedbackData} from '../new-feedback';
import {
    activeRateButton,
    activeRateButtonIcon,
    commentField,
    formDescription,
    inactiveRateButtonIcon,
    rateButton,
    rateButtonsLine,
    rateInput
} from './form.css';

interface Props {
    onCancel(): void;
    onSubmit(data: NewFeedbackData): void;
}

const {useState, useCallback, useContext} = React;
// rating buttons have RTL text direction
const ratingValues: number[] = [5, 4, 3, 2, 1];
const FeedbackForm: React.FunctionComponent<Props> = ({onCancel, onSubmit}) => {
    const i18n = useContext(I18nContext);
    const [error, setError] = useState<AppError | undefined>();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const onRatingSelect = (rating: number) => {
        setError(undefined);
        setRating(rating);
    };
    const onCommentFieldChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.currentTarget.value);
    }, []);
    const onFormSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!rating) {
                return setError(
                    new AppError({
                        code: ErrorCodes.VALIDATION,
                        field: 'rating',
                        text: 'errors.field.required'
                    })
                );
            }

            onSubmit({rating, comment});
        },
        [rating, comment, i18n, onSubmit]
    );
    const fieldErrors: FieldErrors | undefined = error && getFieldErrors(error);
    const ratingFieldError: AppError | undefined = fieldErrors?.rating;

    return (
        <form data-name="feedbackForm" onSubmit={onFormSubmit}>
            <div className={formLine}>{localize(i18n, 'trader.feedback.addFeedbackLinkTitle')}</div>
            <div className={formLine}>
                <div className={rateButtonsLine}>
                    {ratingValues.map((ratingValue: number) => {
                        return (
                            <label
                                key={String(ratingValue)}
                                tabIndex={1}
                                className={`${rateButton} ${ratingValue === rating ? activeRateButton : ''}`}>
                                <input
                                    autoFocus={ratingValue === 5}
                                    type="radio"
                                    key={String(ratingValue)}
                                    name="rating"
                                    data-id={ratingValue}
                                    className={rateInput}
                                    onClick={onRatingSelect.bind(null, ratingValue)}
                                />
                                <Icon type="star" className={activeRateButtonIcon} />
                                <Icon type="star_outline" className={inactiveRateButtonIcon} />
                            </label>
                        );
                    })}
                </div>
                {ratingFieldError && <div className={fieldError}>{localize(i18n, ratingFieldError.text)}</div>}
            </div>
            <div className={formLine}>
                <textarea
                    {...getDisabledAutofillAttrs('comment')}
                    name="comment"
                    className={commentField}
                    required={true}
                    maxLength={300}
                    placeholder={localize(i18n, 'trader.feedback.improvementsTitle')}
                    onChange={onCommentFieldChange}
                    cols={1}
                    rows={1}>
                    {comment}
                </textarea>
            </div>
            <ExternalHtmlContent className={formDescription}>
                {localize(i18n, 'trader.feedback.description', {
                    helpDeskUrl: localize(i18n, 'help.desk.url')
                })}
            </ExternalHtmlContent>
            <div className={buttons}>
                <button type="button" data-name="cancelButton" className={cancelButton} onClick={onCancel}>
                    {localize(i18n, 'trader.forms.actions.cancel')}
                </button>
                <Button type="submit" variant={ButtonVariants.ACCENT} data-name="saveButton" className={confirmButton}>
                    {localize(i18n, 'trader.forms.actions.save')}
                </Button>
            </div>
        </form>
    );
};

export default React.memo(FeedbackForm);
