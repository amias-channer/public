import * as React from 'react';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {pageWrapper, pageWrapperWithHorizontalGap} from './page.css';

type Props = React.PropsWithChildren<{
    'data-name'?: string;
    className?: string;
}>;

const PageWrapper: React.FunctionComponent<Props> = React.memo<Props>(({children, className = '', ...domProps}) => {
    const hasGlobalFullLayout = useGlobalFullLayoutFlag();

    return (
        <div
            {...domProps}
            className={`${pageWrapper} ${hasGlobalFullLayout ? pageWrapperWithHorizontalGap : ''} ${className}`}>
            {children}
        </div>
    );
});

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
