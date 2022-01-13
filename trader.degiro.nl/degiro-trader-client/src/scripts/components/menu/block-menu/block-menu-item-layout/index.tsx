import * as React from 'react';
import Badge from '../../../badge';
import {
    layout,
    layoutBadge,
    layoutContent,
    layoutDescription,
    layoutIconWrapper,
    layoutTitle,
    layoutWithIcon
} from './block-menu-item-layout.css';

export interface BlockMenuItemLayoutProps {
    iconUrl?: string;
    badge?: number;
    title: React.ReactNode;
    description?: React.ReactNode;
    preserveIconSpace?: boolean;
}

const {memo} = React;
const BlockMenuItemLayout: React.FunctionComponent<BlockMenuItemLayoutProps> = ({
    iconUrl,
    badge,
    title,
    description,
    preserveIconSpace = iconUrl !== undefined
}) => (
    <div className={`${layout} ${preserveIconSpace ? layoutWithIcon : ''}`}>
        {iconUrl && (
            <div className={layoutIconWrapper}>
                {/* specify intrinsic size to minimize Cumulative Layout Shift */}
                <img aria-hidden="true" src={iconUrl} alt="" width={28} height={28} />
                {badge !== undefined && <Badge className={layoutBadge}>{badge}</Badge>}
            </div>
        )}
        <div className={layoutContent}>
            <span className={layoutTitle}>{title}</span>
            {description && <span className={layoutDescription}>{description}</span>}
        </div>
    </div>
);

export default memo(BlockMenuItemLayout);
