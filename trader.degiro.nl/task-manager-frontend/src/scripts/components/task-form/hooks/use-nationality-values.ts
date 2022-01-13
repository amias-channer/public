import * as React from 'react';
import {Nationality} from 'frontend-core/dist/models/country';
import {SelectValue} from 'frontend-core/dist/components/ui-trader3/select';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18nContext, NationalitiesContext} from '../../app-component/app-context';

const {useContext, useMemo} = React;

export default function useNationalityValues(customNationalities?: Nationality[]): SelectValue[] {
    const defaultNationalities = useContext(NationalitiesContext);
    const nationalities = customNationalities || defaultNationalities;
    const i18n = useContext(I18nContext);

    return useMemo(
        () => [
            {
                id: '',
                label: localize(i18n, 'taskManager.task.taskForm.nationalitySelect')
            },
            ...nationalities
        ],
        [nationalities, i18n]
    );
}
