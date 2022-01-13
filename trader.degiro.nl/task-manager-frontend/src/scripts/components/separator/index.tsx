import * as React from 'react';
import {separator} from './separator.css';

export interface SeparatorProps extends React.HTMLProps<HTMLDivElement> {
    className?: string;
}

const Separator: React.FunctionComponent<SeparatorProps> = (props) => {
    return <div {...props} className={`${separator} ${props.className || ''}`} />;
};

export default Separator;
