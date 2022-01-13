import * as React from 'react';
import BaseNoDataMessage from '../../no-data-message/index';
import {compactViewNoDataToDisplay, noDataToDisplay} from './no-data-message.css';

interface Props {
    hasCompactLayout: boolean;
    className?: string;
}

const NoDataMessage: React.FunctionComponent<Props> = ({hasCompactLayout, className = ''}) => (
    <BaseNoDataMessage
        className={`${noDataToDisplay} ${hasCompactLayout ? compactViewNoDataToDisplay : ''} ${className}`}
    />
);

export default React.memo(NoDataMessage);
