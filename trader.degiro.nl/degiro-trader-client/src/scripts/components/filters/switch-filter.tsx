import {formLine} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import * as React from 'react';
import Switch from '../switch/index';
import {nbsp} from '../value';
import {filterLabel, filtersSection, switchFilterLayout} from './filters.css';
import {FiltersData} from './index';

interface Props<T extends FiltersData> {
    isFormLine?: boolean;
    disabled?: boolean;
    label: React.ReactNode;
    field: string;
    className?: string;
    checked?: boolean;
    onChange(field: keyof T & string, value: boolean): void;
}

const {useCallback} = React;
const SwitchFilter = <FiltersValues extends FiltersData>({
    isFormLine,
    className = '',
    field,
    label,
    checked,
    disabled,
    onChange,
    children
}: React.PropsWithChildren<Props<FiltersValues>>) => {
    const toggle = useCallback(() => onChange(field, !checked), [field, checked, onChange]);

    return (
        <div className={`${isFormLine ? formLine : filtersSection} ${className}`}>
            {isFormLine ? null : <div className={filterLabel}>{nbsp}</div>}
            <div className={switchFilterLayout}>
                <Switch name={field} label={label} disabled={disabled} checked={checked} onChange={toggle} />
                {children}
            </div>
        </div>
    );
};

export default React.memo(SwitchFilter) as <T extends Record<string, any>>(
    props: React.PropsWithChildren<Props<T>>
) => JSX.Element;
