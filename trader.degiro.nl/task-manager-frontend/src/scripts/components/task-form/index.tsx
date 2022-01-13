import Button from 'frontend-core/dist/components/ui-trader3/button/index';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError, ErrorCodes, FieldErrors} from 'frontend-core/dist/models/app-error';
import {Country, Nationality} from 'frontend-core/dist/models/country';
import {I18n} from 'frontend-core/dist/models/i18n';
import {Task, TasksInfo} from 'frontend-core/dist/models/task/task';
import {User} from 'frontend-core/dist/models/user';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import getFieldError from 'frontend-core/dist/services/app-error/get-field-error';
import getFieldErrors from 'frontend-core/dist/services/app-error/get-field-errors';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import hasFormError from 'frontend-core/dist/services/form/has-form-error';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import getTaskDescription from 'frontend-core/dist/services/task/get-task-description';
import getTaskTitle from 'frontend-core/dist/services/task/get-task-title';
import {History, Location} from 'history';
import * as React from 'react';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';
import {TaskConfirmationTypes, TaskResult} from '../../models/task';
import {Routes} from '../../navigation';
import shouldSendGenericTaskCompleteEvent from '../../services/analytics/should-send-generic-task-complete-event';
import isMissingTaskError from '../../services/task/is-missing-task-error';
import {AppComponentApi} from '../app-component';
import InlineButton from '../button/inline';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import Icon from '../icon/index';
import Separator from '../separator/index';
import SkipTaskLink from '../skip-task-link/index';
import TaskAgreementCheckboxForm from '../task-agreement/task-agreement-checkbox-form';
import TasksLink from '../tasks-link';
import prepareFormValue from './prepare-form-value';
import TaskDescription from './task-description';
import * as taskFormStyles from './task-form.css';
import TaskTitle from './task-title';

export interface TaskFormState {
    isLoading?: boolean;
    hasInitialData?: boolean;
    formData: TaskFormData;
    error?: AppError;
    taskResult?: TaskResult | undefined | void;
}

export interface TaskFormData {
    [key: string]: any;
}

interface TaskFormCloseReason {
    text?: string;
    message?: string;
}

export type TaskFormCloseHandler = (data?: TaskFormCloseReason) => any;
export type TaskFormSubmitHandler = (...args: any[]) => any;

export interface TaskFormProps extends AppComponentApi {
    location: Location;
    history: History;
    i18n: I18n;
    config: Config;
    mainClient: User;
    currentClient: User;
    tasksInfo: TasksInfo;
    countries: Country[];
    nationalities: Nationality[];
    appParams: AppParams;
    task: Task;
    /** @deprecated This property is used only for FATCA tasks, TODO: remove this prop. after removing FATCA tasks */
    onClose: TaskFormCloseHandler;
    onSubmit: TaskFormSubmitHandler;
    onBack?: () => void;
    children?: React.ReactNode | React.ReactNode[];
}

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use function component instead
 * @class
 */
export default class TaskForm<
    Props extends TaskFormProps = TaskFormProps,
    State extends TaskFormState = TaskFormState
> extends React.PureComponent<Props, State> {
    protected form?: HTMLFormElement | null;
    protected renderTaskDescriptionHint?: (hintTranslationCode: string) => React.ReactNode | React.ReactNode[];
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            hasInitialData: true,
            formData: {}
        } as State;

        // Bind all methods that can be overridden manually
        this.getCountryValues = this.getCountryValues.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onFormDataChange = this.onFormDataChange.bind(this);
        this.onSubmitResult = this.onSubmitResult.bind(this);
        this.onSubmitError = this.onSubmitError.bind(this);
    }

    private onFormRef = (form: HTMLFormElement | null) => (this.form = form);

    /**
     * @description By default form data is validate only on backend
     *  [WF-1861] all validations of questionnaire should be done only on the server because answers could be optional
     * @returns {boolean}
     */
    protected validate(): boolean {
        return true;
    }

    protected sendSubmitRequest(): Promise<TaskResult | undefined | void | {[key: string]: any}> {
        return Promise.reject(new Error('`sendSubmitRequest` is not specified'));
    }

    protected onSubmitForm(event: React.FormEvent<HTMLElement>) {
        event.preventDefault();

        const isValid: boolean = this.validate();

        if (!isValid) {
            return;
        }

        this.setState({
            isLoading: true,
            taskResult: undefined,
            error: undefined
        });

        // the success result is handled by parent Component
        this.sendSubmitRequest().then(this.onSubmitResult).catch(this.onSubmitError);
    }

    protected redirectToTasks = () => this.props.history.push(Routes.TASKS);

    protected redirectToTask = (taskId: number) => this.props.history.replace(`${Routes.TASKS}/${taskId}`);

    protected onSubmitResult(result: TaskResult | {[key: string]: any} | undefined | void) {
        const nextTaskId = result && (result as TaskResult).nextTaskId;
        const confirmationType = result && (result as TaskResult).confirmationType;

        if (nextTaskId != null) {
            const {task} = this.props;

            // do not send an event for the tasks that have their own 'taskComplete' triggers
            if (shouldSendGenericTaskCompleteEvent(task)) {
                trackAnalytics(TrackerEventTypes.TASK_COMPLETE, {taskType: task.taskType});
            }

            return this.redirectToTask(nextTaskId);
        }

        if (confirmationType) {
            return this.setState({
                isLoading: false,
                taskResult: result
            });
        }

        return this.props.onSubmit(result);
    }

    protected getCommonSubmitError(error: Error | AppError): AppError {
        const firstError: AppError | undefined = isAppError(error) ? error.errors[0] : undefined;

        // Show first error text if we have that
        if (firstError && firstError.code === ErrorCodes.VALIDATION) {
            return new AppError({text: firstError.text});
        }

        // continue using error if it has a message
        if (isAppError(error) && error.text) {
            return error;
        }

        return new AppError({text: 'errors.serviceError'});
    }

    protected onSubmitError(error: Error | AppError) {
        logErrorLocally(error);

        if (isMissingTaskError(error)) {
            return this.redirectToTasks();
        }

        // don't show error modal for field errors
        if (isAppError(error) && hasFormError(error, Object.keys(this.state.formData))) {
            this.setState({error, isLoading: false});
            return;
        }

        this.props.openErrorModal(this.getCommonSubmitError(error));
        this.setState({isLoading: false});
    }

    protected prepareFormValue(el: HTMLElement): any {
        return prepareFormValue(el);
    }

    protected updateFormDataAfterFieldChange(_fieldName: string, formData: TaskFormData): TaskFormData {
        return formData;
    }

    protected canStoreFormFieldData(fieldName: string): boolean {
        return fieldName in this.state.formData;
    }

    protected onFormDataChange(event: React.FormEvent<any>) {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        const {name} = input;

        // store the fields' data only from `formData` and skip the others fields
        if (this.canStoreFormFieldData(name)) {
            this.setState({
                formData: this.updateFormDataAfterFieldChange(name, {
                    ...this.state.formData,
                    [name]: this.prepareFormValue(input)
                })
            });
        }
    }

    protected renderForm() {
        // render form
    }

    protected focusOnInvalidField(validationErrors: FieldErrors | void) {
        const {form} = this;

        if (!form || !validationErrors) {
            return;
        }

        Object.keys(validationErrors).some((name: string): boolean => {
            const fields: NodeListOf<HTMLElement> = form.querySelectorAll<HTMLElement>(`[name="${name}"]`);
            let el: HTMLElement | undefined = fields[0];

            [].some.call(fields, (fieldElement: HTMLElement): boolean => {
                if ((fieldElement as HTMLInputElement).checked) {
                    el = fieldElement;
                    // we can find 2 radio inputs, let's focus on the active one
                    return true;
                }

                return false;
            });

            if (el) {
                el.scrollIntoView(true);
                el.focus();
                return true;
            }

            return false;
        });
    }

    protected getCountryValues(countries: Country[]): Country[] {
        return [{id: '', label: localize(this.props.i18n, 'taskManager.task.taskForm.countrySelect')}, ...countries];
    }

    protected getNationalityValues(nationalities: Nationality[]): Nationality[] {
        return [
            {id: '', label: localize(this.props.i18n, 'taskManager.task.taskForm.nationalitySelect')},
            ...nationalities
        ];
    }

    protected renderFieldError(fieldName: string) {
        const {error} = this.state;
        const fieldError: AppError | undefined = error && getFieldError(error, fieldName);

        if (!fieldError || !fieldError.text) {
            return;
        }

        return <div className={taskFormStyles.formFieldHintError}>{localize(this.props.i18n, fieldError.text)}</div>;
    }

    protected canRenderBackButton(): boolean {
        return typeof this.props.onBack === 'function';
    }

    protected canRenderSkipTaskLink(): boolean {
        return !this.props.tasksInfo?.hasOverdueTask;
    }

    protected canRenderSubmitButton(): boolean {
        return true;
    }

    protected renderButtons(): React.ReactNode {
        return (
            <div className={gridStyles.row}>
                <Cell size={12} className={taskFormStyles.formButtons}>
                    {this.canRenderBackButton() && this.renderBackButton()}
                    {this.canRenderSkipTaskLink() && this.renderSkipTaskLink()}
                    {this.canRenderSubmitButton() && this.renderSubmitButton()}
                </Cell>
            </div>
        );
    }

    protected renderSkipTaskLink(): React.ReactNode {
        return <SkipTaskLink className={taskFormStyles.skipTaskLink} task={this.props.task} />;
    }

    protected renderBackButton(props?: {onClick?: () => void; label?: React.ReactNode}): React.ReactNode {
        const {onClick = this.props.onBack, label = localize(this.props.i18n, 'taskManager.task.navigateBackAction')} =
            props || {};

        if (!onClick) {
            return null;
        }

        return (
            <InlineButton
                data-name="taskBackButton"
                className={taskFormStyles.formBackButton}
                // We should avoid passing event object to onClick
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onClick()}>
                <Icon type="chevron-left_regular" />
                {label}
            </InlineButton>
        );
    }

    protected renderSubmitButton(props?: {label?: React.ReactNode; isNextStepButton?: boolean}): React.ReactNode {
        const {
            isNextStepButton,
            label = localize(
                this.props.i18n,
                isNextStepButton ? 'taskManager.task.goToNextStep' : 'taskManager.task.submitTask'
            )
        } = props || {};

        return (
            <Button type="submit" className={taskFormStyles.formSubmitButton}>
                {label}
            </Button>
        );
    }

    protected getTaskDescriptionTranslationCode(): string | void {
        return getTaskDescription(this.props.task);
    }

    protected renderTaskDescription(): React.ReactNode {
        const {i18n} = this.props;
        const taskDescriptionTranslationCode: string | void = this.getTaskDescriptionTranslationCode();

        if (!taskDescriptionTranslationCode || !hasTranslation(i18n, taskDescriptionTranslationCode)) {
            return null;
        }

        return (
            <TaskDescription
                translationCode={taskDescriptionTranslationCode}
                renderHint={this.renderTaskDescriptionHint}
            />
        );
    }

    protected getTaskTitleTranslationCode(): string {
        return getTaskTitle(this.props.task);
    }

    protected getTaskTitle(): React.ReactNode {
        return localize(this.props.i18n, this.getTaskTitleTranslationCode());
    }

    protected renderTaskTitle(): React.ReactNode {
        return <TaskTitle>{this.getTaskTitle()}</TaskTitle>;
    }

    protected renderAgreementCheckboxFormContent(): React.ReactNode {
        return null;
    }

    protected goBackFromAgreementStep = () => {
        this.setState({
            taskResult: undefined
        });
    };

    protected onAgreementConfirmed = (taskResult: TaskResult | undefined) => {
        this.props
            .onFinishTask(this.props.task)
            .then(() => this.onSubmitResult(taskResult))
            .catch(logErrorLocally);
    };

    protected renderAgreementCheckboxForm(): React.ReactNode | React.ReactNode[] {
        const {i18n} = this.props;

        return (
            <TaskAgreementCheckboxForm task={this.props.task} onSubmitResult={this.onAgreementConfirmed}>
                {this.renderAgreementCheckboxFormContent()}
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Separator />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} className={taskFormStyles.formButtons}>
                        <div />
                        <Button className={taskFormStyles.formSubmitButton} type="submit">
                            {localize(i18n, 'taskManager.task.submitTask')}
                        </Button>
                    </Cell>
                </div>
            </TaskAgreementCheckboxForm>
        );
    }

    componentDidUpdate(_prevProps: Props, prevState: State) {
        const {error} = this.state;

        // Set a focus on an invalid field only first time when error appears
        // Possible problems - [WF-2031?focusedCommentId=420511#comment-420511]
        if (error && !prevState.error) {
            this.focusOnInvalidField(getFieldErrors(error));
        }
    }

    render(): JSX.Element | null {
        const {taskResult} = this.state;
        const {i18n} = this.props;
        const confirmationType: TaskConfirmationTypes | void = taskResult && taskResult.confirmationType;

        return (
            <div>
                {this.renderTaskTitle()}
                {this.renderTaskDescription()}
                {this.state.isLoading ? (
                    <Spinner local={true} />
                ) : confirmationType === TaskConfirmationTypes.AGREEMENT_CHECKBOX ? (
                    this.renderAgreementCheckboxForm()
                ) : this.state.hasInitialData ? (
                    <form
                        method="POST"
                        autoComplete="off"
                        className={taskFormStyles.form}
                        ref={this.onFormRef}
                        onChange={this.onFormDataChange}
                        onSubmit={this.onSubmitForm}>
                        {this.renderForm()}
                        <div className={gridStyles.row}>
                            <Cell size={12}>
                                <Separator />
                            </Cell>
                        </div>
                        {this.renderButtons()}
                    </form>
                ) : (
                    <div className={gridStyles.row}>
                        <Cell size={12} align="center">
                            <TasksLink>{localize(i18n, 'taskManager.task.navigateBackAction')}</TasksLink>
                        </Cell>
                    </div>
                )}
            </div>
        );
    }
}
