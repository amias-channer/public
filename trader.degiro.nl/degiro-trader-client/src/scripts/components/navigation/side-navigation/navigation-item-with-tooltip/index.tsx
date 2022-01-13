import useToggle from 'frontend-core/dist/hooks/use-toggle';
import * as React from 'react';
import {popoverContent, popoverLayout, root} from './navigation-item-with-tooltip.css';
import schedulePopoverPositionCalculation from './schedule-popover-position-calculation';

interface Props {
    renderTooltip(): React.ReactElement | string;
}

const {useRef, useEffect} = React;
const NavigationItemWithTooltip: React.FunctionComponent<Props> = ({renderTooltip, children}) => {
    const rootElRef = useRef<HTMLDivElement>(null);
    const popoverElRef = useRef<HTMLDivElement>(null);
    const {isOpened, open, close} = useToggle(false);

    useEffect(() => {
        const {current: rootEl} = rootElRef;
        const {current: popoverEl} = popoverElRef;

        if (isOpened && rootEl && popoverEl) {
            return schedulePopoverPositionCalculation(popoverEl, rootEl);
        }
    }, [isOpened]);

    return (
        <div ref={rootElRef} className={root} onMouseOver={open} onMouseLeave={close}>
            {children}
            {isOpened && (
                <div className={popoverLayout} ref={popoverElRef}>
                    <div className={popoverContent}>{renderTooltip()}</div>
                </div>
            )}
        </div>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(NavigationItemWithTooltip);
