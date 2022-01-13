import Checkbox from 'frontend-core/dist/components/ui-trader3/checkbox';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Task} from 'frontend-core/dist/models/task/task';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import Cell from '../grid/cell';
import * as gridStyles from '../grid/grid.css';
import TextWithHints from '../text-with-hints/index';

interface Props {
    fieldName: string;
    checked?: boolean;
    'data-name'?: string;
    description?: string;
    task: Task;
    error?: AppError;
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

const {useContext} = React;
const TaskAgreementCheckboxData: React.FunctionComponent<Props> = ({
    checked,
    description,
    error,
    task: {taskType},
    fieldName,
    onChange,
    'data-name': dataName
}) => {
    const i18n = useContext(I18nContext);
    const taskControlTranslationCode: string = `task.${taskType}.agreeWithTerms`;
    const taskTitleTranslationCode: string = `task.${taskType}.agreementTitle`;
    const taskDescriptionTranslationCode: string = `task.${taskType}.agreementDescription`;

    return (
        <div data-name={dataName}>
            <div className={gridStyles.row}>
                <Cell size={12}>
                    <strong>
                        {localize(
                            i18n,
                            hasTranslation(i18n, taskTitleTranslationCode)
                                ? taskTitleTranslationCode
                                : 'task.agreementTitle'
                        )}
                    </strong>
                </Cell>
            </div>
            <div className={gridStyles.row}>
                <Cell size={12}>
                    <TextWithHints
                        translationCode={
                            description ||
                            (hasTranslation(i18n, taskDescriptionTranslationCode)
                                ? taskDescriptionTranslationCode
                                : 'task.agreementDescription')
                        }
                    />
                </Cell>
                <Cell size={12}>
                    <Checkbox
                        checked={checked}
                        required={true}
                        onChange={onChange}
                        error={error}
                        name={fieldName}
                        label={localize(
                            i18n,
                            hasTranslation(i18n, taskControlTranslationCode)
                                ? taskControlTranslationCode
                                : 'task.agreeWithTerms'
                        )}
                    />
                </Cell>
            </div>
        </div>
    );
};

export default TaskAgreementCheckboxData;
