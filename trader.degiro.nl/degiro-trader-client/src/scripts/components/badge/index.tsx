import * as React from 'react';
import {badge} from './badge.css';

export interface BadgeProps {
    className?: string;
    children: number | string;
}

const {memo} = React;
const Badge: React.FunctionComponent<BadgeProps> = ({className = '', children}) => (
    <span className={`${badge} ${className}`}>{children}</span>
);

export default memo(Badge);
