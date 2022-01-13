import Select, {SelectValue} from 'frontend-core/dist/components/ui-trader3/select/index';
import {AppError} from 'frontend-core/dist/models/app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import localizeError from 'frontend-core/dist/services/i18n/localize-error';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';

export interface GenderSelectorProps {
    name: string;
    controlClassName?: string;
    dataName?: string;
    value?: string;
    required?: boolean;
    error?: AppError;
    addOptionAll?: boolean;
    selectClassName?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const {useContext, useMemo} = React;
const GenderSelector: React.FunctionComponent<GenderSelectorProps> = ({
    required,
    addOptionAll,
    error,
    name,
    dataName = name,
    value,
    selectClassName,
    controlClassName,
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const values: SelectValue[] = useMemo(
        () => [
            ...(addOptionAll
                ? [
                      {
                          id: '',
                          label: localize(i18n, 'taskManager.task.taskForm.genderSelect')
                      }
                  ]
                : []),
            {
                id: 'male',
                label: localize(i18n, 'taskManager.task.taskForm.male')
            },
            {
                id: 'female',
                label: localize(i18n, 'taskManager.task.taskForm.female')
            }
        ],
        [i18n, addOptionAll]
    );

    return (
        <Select
            className={selectClassName}
            label={localize(i18n, 'taskManager.task.taskForm.gender')}
            error={error && localizeError(i18n, error)}
            name={name}
            controlClassName={controlClassName}
            required={required}
            data-field-name={dataName}
            value={value}
            values={values}
            onChange={onChange}
        />
    );
};

export default GenderSelector;
