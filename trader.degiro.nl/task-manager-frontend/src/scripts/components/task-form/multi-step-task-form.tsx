import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import {getPathFromStepName} from '../../services/analytics/get-path-from-step-name';
import getTaskFormVirtualPageLocation from '../../services/analytics/get-task-form-virtual-page-location';
import {StepViewTrackParams} from './hooks/use-task-steps';
import TaskForm, {TaskFormProps, TaskFormState} from './index';

export interface MultiStepTaskFormState extends TaskFormState {
    step: string;
    initialStep: string;
    stepsHistory: string[];
}

// eslint-disable-next-line valid-jsdoc
/**
 * @deprecated Use function component instead
 * @class
 */
export default class MultiStepTaskForm<
    Props extends TaskFormProps = TaskFormProps,
    State extends MultiStepTaskFormState = MultiStepTaskFormState
> extends TaskForm<Props, State> {
    protected trackStepView = (params: StepViewTrackParams = {subPath: ''}) => {
        const {task} = this.props;
        const pageUrl: string = getTaskFormVirtualPageLocation(task);

        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {
            page: `${pageUrl}/${getPathFromStepName(this.state.step)}/${params.subPath}`,
            taskType: task.taskType
        });
    };

    protected goToPrevStep = (step?: string): void => {
        let stepsHistory: string[] = this.state.stepsHistory.slice(0);
        // eject the last step from the history
        let prevStep: string | undefined = stepsHistory.pop();

        if (step) {
            stepsHistory = stepsHistory.slice(0, stepsHistory.indexOf(step));
            prevStep = step;
        }

        if (prevStep) {
            this.props.scrollPageToTop();
            this.setState({
                stepsHistory: prevStep === this.state.initialStep ? [] : stepsHistory,
                step: prevStep
            });
        }
    };

    protected goToNextStep = (
        step: string,
        options?: {skipCurrentStepInHistory?: boolean; trackStep?: boolean},
        onStateUpdate?: Function
    ): void => {
        const {stepsHistory} = this.state;
        const {skipCurrentStepInHistory, trackStep} = options || {};

        this.props.scrollPageToTop();
        this.setState(
            {
                step,
                stepsHistory: skipCurrentStepInHistory ? stepsHistory : stepsHistory.concat(this.state.step)
            },
            () => {
                if (trackStep) {
                    this.trackStepView();
                }

                if (typeof onStateUpdate === 'function') {
                    onStateUpdate();
                }
            }
        );
    };

    protected goToInitialStep = () => {
        this.props.scrollPageToTop();
        this.setState({step: this.state.initialStep, stepsHistory: []}, this.trackStepView);
    };
}
