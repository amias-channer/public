import Button from 'frontend-core/dist/components/ui-trader3/button';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    onSubmit(): void;
}

const {useContext, useCallback} = React;
const WelcomeStep: React.FunctionComponent<Props> = ({task, onSubmit}) => {
    const i18n = useContext(I18nContext);
    const i18nTranslationCode = `task.${task.taskType}.WELCOME_STEP`;
    const goToNextStep = useCallback(() => onSubmit(), [onSubmit]);

    return (
        <>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
            <div className={taskFormStyles.form}>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Separator />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} className={taskFormStyles.formButtons}>
                        <Button className={taskFormStyles.formSubmitButton} onClick={goToNextStep}>
                            {localize(i18n, 'taskManager.task.goToNextStep')}
                        </Button>
                    </Cell>
                </div>
            </div>
        </>
    );
};

export default React.memo(WelcomeStep);
