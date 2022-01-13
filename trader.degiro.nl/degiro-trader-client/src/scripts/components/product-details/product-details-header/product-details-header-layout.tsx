import useIntersectionObserver from 'frontend-core/dist/hooks/use-intersection-observer';
import * as React from 'react';
import useElementSize from 'frontend-core/dist/hooks/use-element-size';
import getAppTopScrollableElement from '../../app-component/get-app-top-scrollable-element';
import {dockableLine, header as headerClassName} from '../product-details.css';
import {show, hide, stickyHeader as stickyHeaderClassName, line} from './product-details-header.css';

interface Props {
    header: React.ReactElement;
    stickyHeader: React.ReactElement;
    dockable: boolean;
}

const {useRef, useLayoutEffect} = React;
const stickyHeaderThreshold: number = 0.6;
const navigationHeight: number = 48;
const threshold = [1.0, stickyHeaderThreshold];
const ProductDetailsHeaderLayout: React.FunctionComponent<Props> = React.memo(({dockable, header, stickyHeader}) => {
    const headerRef = useRef<HTMLHeadingElement | null>(null);
    const headerContent = useRef<HTMLDivElement | null>(null);
    const headerContentSize = useElementSize(headerContent);
    const headerContentHeight = headerContentSize?.height;
    const {setTargetElement, setRootElement, entry} = useIntersectionObserver({threshold});
    const isHeaderDocked: boolean =
        dockable &&
        entry !== undefined &&
        entry.intersectionRatio <= stickyHeaderThreshold &&
        entry.intersectionRatio >= 0;
    const top: number | undefined =
        !isHeaderDocked && headerContentHeight ? navigationHeight - headerContentHeight : undefined;

    useLayoutEffect(() => setRootElement(getAppTopScrollableElement()), []);
    useLayoutEffect(() => setTargetElement(dockable ? headerRef.current : null), [dockable]);

    return (
        <header
            ref={headerRef}
            className={`${headerClassName} ${isHeaderDocked ? stickyHeaderClassName : ''}`}
            // [REFINITIV-2002]
            // eslint-disable-next-line react/forbid-dom-props
            style={{height: headerContentHeight, top}}>
            <div ref={headerContent} className={`${line} ${isHeaderDocked ? hide : show}`}>
                {header}
            </div>
            {dockable && (
                <div className={`${line} ${isHeaderDocked ? show : hide} ${dockableLine}`}>{stickyHeader}</div>
            )}
        </header>
    );
});

ProductDetailsHeaderLayout.displayName = 'ProductDetailsHeaderLayout';
export default ProductDetailsHeaderLayout;
