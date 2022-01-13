import getSelectOptionFromPrimitive from 'frontend-core/dist/components/ui-trader4/select/get-select-option-from-primitive';
import Select, {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import * as React from 'react';
import {defaultPageSizes} from '../../models/pagination';

export interface PageSizeSelectorProps {
    pageSize: number;
    className?: string;
    options?: number[] | ReadonlyArray<number>;
    onChange(pageSize: number): void;
}

const PageSizeSelector: React.FunctionComponent<PageSizeSelectorProps> = ({
    options = defaultPageSizes,
    className,
    pageSize,
    onChange
}) => (
    <Select
        name="pageSizeSelector"
        size={SelectSizes.XSMALL}
        onChange={onChange}
        className={className}
        searchable={false}
        selectedOption={getSelectOptionFromPrimitive(pageSize)}
        options={options.map(getSelectOptionFromPrimitive)}
    />
);

export default React.memo(PageSizeSelector);
