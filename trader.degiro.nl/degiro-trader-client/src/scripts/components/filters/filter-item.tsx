import * as React from 'react';
import {medium, placeholder, xLarge} from './filters-layout/filters-layout.css';
import {filterLabel} from './filters.css';

type Size = 'medium' | 'xLarge';
type Props = React.PropsWithChildren<{
    label?: React.ReactNode;
    size?: Size;
}>;

const classNamesBySize: Record<Size, string> = {
    medium,
    xLarge
};
const {memo} = React;
const FilterItem = memo<Props>(({label, size = 'medium', children}) => {
    return (
        <div className={`${placeholder} ${classNamesBySize[size]}`}>
            {label && <div className={filterLabel}>{label}</div>}
            {children}
        </div>
    );
});

FilterItem.displayName = 'FilterItem';
export default FilterItem;
