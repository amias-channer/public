import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {collapsedFiltersSectionButton, activeFiltersButtonIcon} from './filters.css';

interface Props {
    onClick(): void;
    isActive?: boolean;
    className?: string;
}

const CollapsedFiltersButton: React.FunctionComponent<Props> = ({className = '', isActive, onClick}) => (
    <button
        type="button"
        data-name="collapsedFiltersButton"
        className={`${collapsedFiltersSectionButton} ${className}`}
        onClick={onClick}>
        <Icon type="tune" />
        {isActive && <Icon type="bullet" className={activeFiltersButtonIcon} />}
    </button>
);

export default React.memo(CollapsedFiltersButton);
