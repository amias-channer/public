import * as React from 'react';

export enum SpinnerModes {
    GLOBAL = 'GLOBAL',
    INLINE = 'INLINE'
}

export interface SpinnerProps {
    mode?: SpinnerModes;
    className?: string;
    layoutClassName?: string;
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({layoutClassName = '', className = '', mode}) => {
    const spinner: React.ReactElement<HTMLElement> = (
        <div data-name="spinner" className={`spinner ${className}`} role="progressbar" />
    );

    if (mode === SpinnerModes.INLINE) {
        return spinner;
    }

    if (mode === SpinnerModes.GLOBAL) {
        return <div className={`spinner-global-layout ${layoutClassName}`}>{spinner}</div>;
    }

    return <div className={`spinner-local-layout ${layoutClassName}`}>{spinner}</div>;
};

export default React.memo(Spinner);
