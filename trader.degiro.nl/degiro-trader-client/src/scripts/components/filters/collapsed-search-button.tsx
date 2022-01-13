import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {collapsedFiltersSectionButton, activeFiltersButtonIcon} from './filters.css';

interface Props {
    onClick(): void;
    isActive?: boolean;
    className?: string;
}

const CollapsedSearchButton: React.FunctionComponent<Props> = ({isActive, className = '', onClick}) => (
    <button
        type="button"
        data-name="collapsedSearchButton"
        className={`${collapsedFiltersSectionButton} ${className}`}
        onClick={onClick}>
        <Icon type="search" />
        {isActive && <Icon type="bullet" className={activeFiltersButtonIcon} />}
    </button>
);

export default React.memo(CollapsedSearchButton);
