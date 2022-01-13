import * as React from 'react';
import {disclaimer, disclaimerFooterLayout, lighterDisclaimer} from './disclaimer.css';

export interface Props {
    isFooter?: boolean;
    isInverted?: boolean;
}

const Disclaimer: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
    children,
    isFooter = true,
    isInverted = false
}) => {
    return (
        <div
            className={`
            ${disclaimer}
            ${isFooter ? disclaimerFooterLayout : ''}
            ${isInverted ? lighterDisclaimer : ''}`}>
            {children}
        </div>
    );
};

export default React.memo(Disclaimer);
