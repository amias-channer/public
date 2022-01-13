import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {
    compactExpandableButton,
    expandableButton,
    separator,
    icon,
    label as labelClassName
} from './expandable-button.css';

interface Props {
    onToggle(): void;
    label: string;
    isExpanded: boolean;
    hasCompactLayout: boolean;
}

const ExpandableButton: React.FunctionComponent<Props> = ({onToggle, label, isExpanded, hasCompactLayout}) => (
    <button
        type="button"
        className={`${expandableButton} ${hasCompactLayout ? compactExpandableButton : ''}`}
        onClick={() => onToggle()}>
        {label}
        {isExpanded ? (
            <>
                <Icon className={icon} type="minus_circle" />
                <div className={separator} />
                <span className={labelClassName}>{label}</span>
                <div className={separator} />
                <Icon className={icon} type="minus_circle" />
            </>
        ) : (
            <Icon className={icon} type="add_circle" />
        )}
    </button>
);

export default React.memo(ExpandableButton);
