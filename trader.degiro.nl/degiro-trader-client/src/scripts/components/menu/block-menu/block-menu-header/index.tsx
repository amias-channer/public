import * as React from 'react';
import BlockMenuTitle from '../block-menu-title';
import {header, headerTitle} from './block-menu-header.css';

export interface BlockMenuHeaderProps {
    title: React.ReactNode;
    subTitle?: React.ReactNode;
}

const {memo} = React;
const BlockMenuHeader: React.FunctionComponent<BlockMenuHeaderProps> = ({title, subTitle}) => (
    <div className={header}>
        <BlockMenuTitle className={headerTitle}>{title}</BlockMenuTitle>
        {subTitle && <span>{subTitle}</span>}
    </div>
);

export default memo(BlockMenuHeader);
