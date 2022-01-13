import {hiddenSelectControl} from 'frontend-core/dist/components/ui-trader4/control-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import {SelectFilterValue} from '../select-filter';
import getSelectOptionLabel from '../select-filter/get-select-option-label';
import {formLine, formLineIcon, formLineValue} from './form-line-select-filter.css';

interface Props<FiltersValues> {
    field: keyof FiltersValues & string;
    values: SelectFilterValue[] | undefined;
    value?: string | number;
    label?: React.ReactNode;
    className?: string;
    onChange(field: keyof FiltersValues & string, value: string): void;
}

const {useCallback, useContext} = React;
const FormLineSelectFilter = <FiltersValues extends Record<string, any>>({
    field,
    values,
    value,
    className = '',
    label = nbsp,
    onChange
}: React.PropsWithChildren<Props<FiltersValues>>) => {
    const i18n = useContext(I18nContext);
    const onSelectChange = useCallback(
        ({currentTarget}: React.FormEvent<HTMLSelectElement>) => {
            onChange(field, currentTarget.value as FiltersValues[keyof FiltersValues]);
        },
        [field, onChange]
    );

    if (!values?.[0]) {
        return null;
    }

    const selectedValue: SelectFilterValue | undefined = values.find(({id}) => String(value) === String(id));

    return (
        <div className={`${formLine} ${className}`}>
            <div>{label}</div>
            <span className={formLineValue}>{selectedValue && getSelectOptionLabel(i18n, selectedValue)}</span>
            <Icon className={formLineIcon} type="keyboard_arrow_down" />
            <select name={field} className={hiddenSelectControl} onChange={onSelectChange}>
                {values.map((value: SelectFilterValue) => {
                    const id = String(value.id);
                    const isSelected: boolean = selectedValue === value;

                    return (
                        <option key={id} value={id} selected={isSelected}>
                            {getSelectOptionLabel(i18n, value)}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default React.memo(FormLineSelectFilter) as <T extends Record<string, any>>(
    props: React.PropsWithChildren<Props<T>>
) => JSX.Element;
