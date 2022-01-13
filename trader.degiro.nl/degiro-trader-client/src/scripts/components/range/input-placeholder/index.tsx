import * as React from 'react';
import {
    inputPlaceholder,
    contentWithPrefix,
    contentWithSuffix,
    content,
    prefix as prefixClassName,
    suffix as suffixClassName
} from './input-placeholder.css';

interface Props {
    className?: string;
    prefix?: React.ReactElement;
    suffix?: React.ReactElement;
    children?: React.ReactElement;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}
const {forwardRef, memo} = React;
const InputPlaceholder = memo(
    forwardRef<HTMLSpanElement, Props>(({onClick, className = '', suffix, prefix, children}, ref) => (
        <span className={`${inputPlaceholder} ${className}`} ref={ref} onClick={onClick}>
            {prefix && <span className={prefixClassName}>{prefix}</span>}
            <span
                className={`
                    ${content}
                    ${prefix ? contentWithPrefix : ''}
                    ${suffix ? contentWithSuffix : ''}
                `}>
                {children}
            </span>
            {suffix && <span className={suffixClassName}>{suffix}</span>}
        </span>
    ))
);

InputPlaceholder.displayName = 'InputPlaceholder';
export default InputPlaceholder;
