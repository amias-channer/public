import * as React from 'react';
import {title} from './block-menu-title.css';

export type BlockMenuTitleProps = React.PropsWithChildren<{
    className?: string;
}>;

const {memo} = React;
const BlockMenuTitle: React.FunctionComponent<BlockMenuTitleProps> = ({className = '', children}) => (
    <h4 className={`${title} ${className}`}>{children}</h4>
);

export default memo(BlockMenuTitle);
