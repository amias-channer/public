import * as React from 'react';
import {
    horizontalScrollPanel,
    horizontalScrollPanelLightShadowedWrapper
} from 'frontend-core/dist/components/ui-trader4/scroll-panel/scroll-panel.css';
import {hiddenLeftShadow, hiddenRightShadow} from './table-shadowed-wrapper.css';
import {hiddenStartStickyCellContentShadow, stickyCellTableWrapper} from '../table.css';

export interface TableShadowedWrapperProps {
    children(props: {
        stickyHeaderCellRef: React.RefObject<HTMLTableHeaderCellElement>;
    }): React.ReactElement<HTMLTableElement>;
}

const {useEffect, useRef} = React;
const TableShadowedWrapper: React.FunctionComponent<TableShadowedWrapperProps> = ({children}) => {
    const scrollPanelRef = useRef<HTMLDivElement>(null);
    const scrollPanelWrapperRef = useRef<HTMLDivElement>(null);
    const stickyHeaderCellRef = useRef<HTMLTableHeaderCellElement>(null);

    useEffect(() => {
        const {current: scrollPanelEl} = scrollPanelRef;
        const {current: scrollPanelWrapperEl} = scrollPanelWrapperRef;

        if (!scrollPanelEl || !scrollPanelWrapperEl) {
            return;
        }
        let frameId: number | undefined;
        const listenerOptions: AddEventListenerOptions = {passive: true};
        const recalculate = () => {
            cancelAnimationFrame(frameId as number);
            const {current: stickyHeaderCellEl} = stickyHeaderCellRef;

            frameId = requestAnimationFrame(() => {
                const {clientWidth, scrollLeft, scrollWidth} = scrollPanelEl;
                const roundedScrollLeft = Math.round(scrollLeft);
                const classNames: string[] = [horizontalScrollPanelLightShadowedWrapper];

                if (roundedScrollLeft === 0 || stickyHeaderCellEl?.offsetLeft === roundedScrollLeft) {
                    classNames.push(hiddenLeftShadow);
                }

                if (
                    roundedScrollLeft === 0 ||
                    !stickyHeaderCellEl ||
                    stickyHeaderCellEl.offsetLeft > roundedScrollLeft
                ) {
                    classNames.push(hiddenStartStickyCellContentShadow);
                }

                if (scrollWidth - clientWidth - roundedScrollLeft === 0) {
                    classNames.push(hiddenRightShadow);
                }

                scrollPanelWrapperEl.className = classNames.join(' ');
            });
        };
        const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(recalculate);

        observer?.observe(scrollPanelEl);
        scrollPanelEl.addEventListener('scroll', recalculate, listenerOptions);

        return () => {
            cancelAnimationFrame(frameId as number);
            observer?.disconnect();
            scrollPanelEl.removeEventListener('scroll', recalculate, listenerOptions);
        };
    }, [scrollPanelRef.current, scrollPanelWrapperRef.current, stickyHeaderCellRef.current]);

    return (
        <div
            data-name="horizontalScrollPanelWrapper"
            className={horizontalScrollPanelLightShadowedWrapper}
            ref={scrollPanelWrapperRef}>
            <div
                data-name="horizontalScrollPanel"
                className={stickyHeaderCellRef.current ? stickyCellTableWrapper : horizontalScrollPanel}
                ref={scrollPanelRef}>
                {children({stickyHeaderCellRef})}
            </div>
        </div>
    );
};

export default React.memo(TableShadowedWrapper);
