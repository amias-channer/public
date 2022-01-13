import Button from 'frontend-core/dist/components/ui-trader3/button';
import {Task} from 'frontend-core/dist/models/task/task';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {MrzInfo} from '../../../models/fourthline';
import {I18nContext} from '../../app-component/app-context';
import InlineButton from '../../button/inline';
import Cell from '../../grid/cell';
import * as gridStyles from '../../grid/grid.css';
import Separator from '../../separator';
import {itemLabel, itemValue} from '../../task-form/info-overview.css';
import TaskDescription from '../../task-form/task-description';
import * as taskFormStyles from '../../task-form/task-form.css';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
    mrzInfo: Partial<MrzInfo>;
    onBack(): void;
    onSubmit(): void;
}

const {useContext, useCallback} = React;
const IdUploadConfirmationStep: React.FunctionComponent<Props> = ({task, mrzInfo, onSubmit, onBack}) => {
    const i18n = useContext(I18nContext);
    const i18nTranslationCode = `task.${task.taskType}.ID_UPLOAD_CONFIRMATION`;
    const taskDescriptionTranslationCode = `${i18nTranslationCode}.description`;
    const birthDate: Date | undefined = mrzInfo.birthDate
        ? parseDate(mrzInfo.birthDate, {keepOriginDate: true})
        : undefined;
    const expirationDate: Date | undefined = mrzInfo.expirationDate
        ? parseDate(mrzInfo.expirationDate, {keepOriginDate: true})
        : undefined;
    const goToNextStep = useCallback(() => onSubmit(), [onSubmit]);

    return (
        <>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            {hasTranslation(i18n, taskDescriptionTranslationCode) && (
                <TaskDescription translationCode={taskDescriptionTranslationCode} />
            )}
            <div data-name="idUploadConfirmationStep" className={taskFormStyles.form}>
                <div className={gridStyles.row}>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.gender')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {mrzInfo.gender}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.firstName')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {mrzInfo.firstName}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.lastName')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {mrzInfo.lastName}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.dateOfBirth')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {birthDate && formatDate(birthDate, 'DD-MM-YYYY')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.nationality')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {mrzInfo.nationality}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.documentNumber')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {mrzInfo.documentNumber}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemLabel}>
                        {localize(i18n, 'taskManager.task.taskForm.dateOfExpiration')}
                    </Cell>
                    <Cell size={6} smallSize={2} mediumSize={4} className={itemValue}>
                        {expirationDate && formatDate(expirationDate, 'DD-MM-YYYY')}
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12}>
                        <Separator />
                    </Cell>
                </div>
                <div className={gridStyles.row}>
                    <Cell size={12} className={taskFormStyles.formButtons}>
                        <InlineButton className={taskFormStyles.formBackButton} onClick={onBack}>
                            {localize(i18n, 'taskManager.task.editAction')}
                        </InlineButton>
                        <Button type="button" className={taskFormStyles.formSubmitButton} onClick={goToNextStep}>
                            {localize(i18n, 'taskManager.task.goToNextStep')}
                        </Button>
                    </Cell>
                </div>
            </div>
        </>
    );
};

export default React.memo(IdUploadConfirmationStep);
