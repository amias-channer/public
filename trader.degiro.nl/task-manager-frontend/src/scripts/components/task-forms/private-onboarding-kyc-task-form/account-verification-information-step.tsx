import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import TaskDescription from '../../task-form/task-description';
import TaskTitle from '../../task-form/task-title';

interface Props {
    task: Task;
}

const {useContext} = React;
const AccountVerificationInformationStep: React.FunctionComponent<Props> = ({task}) => {
    const i18n = useContext(I18nContext);
    const i18nTranslationCode = `task.${task.taskType}.ACCOUNT_VERIFICATION`;

    return (
        <>
            <TaskTitle>{localize(i18n, `${i18nTranslationCode}.title`)}</TaskTitle>
            <TaskDescription translationCode={`${i18nTranslationCode}.description`} />
        </>
    );
};

export default React.memo(AccountVerificationInformationStep);
