import subscribeOnAnimationFrame, {Unsubscribe} from 'frontend-core/dist/utils/subscribe-on-animation-frame';

export default function schedulePopoverPositionCalculation(popover: HTMLElement, rootEl: HTMLElement): Unsubscribe {
    return subscribeOnAnimationFrame(() => {
        const {height: popoverHeight} = popover.getBoundingClientRect();
        const {
            top: rootTopTop,
            left: rootTopLeft,
            width: rootTopWidth,
            height: rootTopHeight
        } = rootEl.getBoundingClientRect();
        const {bottom: documentBottom} = document.body.getBoundingClientRect();
        const menuOffsetLeft: number = rootTopLeft + rootTopWidth;
        // align on top
        let menuOffsetTop: number = rootTopTop;

        if (menuOffsetTop + popoverHeight > documentBottom) {
            // align on bottom
            menuOffsetTop = menuOffsetTop + rootTopHeight - popoverHeight;
        }

        const transformValue = `translate3d(${Math.round(menuOffsetLeft)}px,${Math.round(menuOffsetTop)}px,0)`;

        popover.style.cssText = `opacity:1;transform:${transformValue};`;
    });
}
