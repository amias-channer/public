import * as React from 'react';
import {limitedWidthContent, page} from './page.css';

interface Props {
    className?: string;
    contentClassName?: string;
}

const Page: React.ForwardRefRenderFunction<HTMLDivElement, React.PropsWithChildren<Props>> = (
    {children, className = '', contentClassName = limitedWidthContent},
    ref
) => (
    <section className={`${page} ${className}`} ref={ref}>
        <div className={contentClassName}>{children}</div>
    </section>
);

export default React.memo(React.forwardRef(Page));
