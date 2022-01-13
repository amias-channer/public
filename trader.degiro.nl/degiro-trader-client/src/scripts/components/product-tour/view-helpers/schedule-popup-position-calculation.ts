import subscribeOnAnimationFrame from 'frontend-core/dist/utils/subscribe-on-animation-frame';
import {Unsubscribe} from '../../../event-broker/subscription';
import {focusedElement} from '../product-tour.css';

export default function schedulePopupPositionCalculation(
    popup: HTMLElement,
    popupArrow: HTMLElement,
    appWorkspace: HTMLElement,
    stepElement: HTMLElement
): Unsubscribe {
    return subscribeOnAnimationFrame(() => {
        const {width: popupWidth, height: popupHeight} = popup.getBoundingClientRect();
        const {
            top: elementTop,
            left: elementLeft,
            height: elementHeight,
            width: elementWidth
        } = stepElement.getBoundingClientRect();
        const {
            left: workspaceLeft,
            width: workspaceWidth,
            height: workspaceHeight
        } = appWorkspace.getBoundingClientRect();
        const {width: popupArrowWidth} = popupArrow.getBoundingClientRect();
        const elementHorizontalEnd: number = elementLeft + elementWidth;
        const elementHorizontalCenter: number = elementLeft + elementWidth / 2;
        const elementVerticalEnd: number = elementTop + elementHeight;
        const workspaceHorizontalEnd: number = workspaceLeft + workspaceWidth;
        const verticalGutter: number = 16;
        const horizontalGutter: number = 8;
        // align on top
        let popupOffsetTop: number = elementVerticalEnd + verticalGutter;
        // align on center
        let popupOffsetLeft: number = elementLeft - (popupWidth - elementWidth) / 2;

        if (popupOffsetTop + popupHeight >= workspaceHeight) {
            // align on bottom
            popupOffsetTop = elementTop - popupHeight - verticalGutter;
        }

        // normalize top margin
        if (popupOffsetTop < verticalGutter) {
            popupOffsetTop = verticalGutter;
        }

        if (popupOffsetLeft <= workspaceLeft) {
            // align to left
            popupOffsetLeft = elementLeft;
        } else if (popupOffsetLeft + popupWidth >= workspaceHorizontalEnd) {
            // align to right
            popupOffsetLeft = elementHorizontalEnd - popupWidth;
        }

        // normalize right margin
        if (workspaceHorizontalEnd - (popupOffsetLeft + popupWidth) < horizontalGutter) {
            popupOffsetLeft -= horizontalGutter;
        }

        // normalize left margin
        if (popupOffsetLeft < horizontalGutter) {
            popupOffsetLeft = horizontalGutter;
        }
        const popupVerticalEnd: number = popupOffsetTop + popupHeight;
        const isPopupBottomAligned = popupVerticalEnd <= elementVerticalEnd;
        const popupArrowTransformX: string = `${Math.round(
            elementHorizontalCenter - popupOffsetLeft - popupArrowWidth / 2
        )}px`;
        const popupArrowTransformY: string = isPopupBottomAligned ? `${Math.round(popupHeight)}px` : '-100%';

        popupArrow.style.cssText = `transform:translate(${popupArrowTransformX},${popupArrowTransformY})${
            isPopupBottomAligned ? ' rotate(180deg)' : ''
        };`;
        popup.style.cssText = `opacity:1;transform:translate(${Math.round(popupOffsetLeft)}px,${Math.round(
            popupOffsetTop
        )}px);`;
        stepElement.classList.add(focusedElement);
    });
}
