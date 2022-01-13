import clampInterval from '../../../utils/interval/clamp-interval';
import putIntervalAfter from '../../../utils/interval/put-interval-after';
import putIntervalAfterStart from '../../../utils/interval/put-interval-after-start';
import putIntervalBefore from '../../../utils/interval/put-interval-before';
import putIntervalBeforeEnd from '../../../utils/interval/put-interval-before-end';
import putIntervalInMiddle from '../../../utils/interval/put-interval-in-middle';
import pipe from '../../../utils/pipe';
const positionMap = {
    before: putIntervalBefore,
    after: putIntervalAfter,
    'inside-start': putIntervalAfterStart,
    'inside-center': putIntervalInMiddle,
    'inside-end': putIntervalBeforeEnd
};
export default function getCssTextOfPopupRelativeToTarget(target, popup, documentBody, { verticalPosition, horizontalPosition, gutter, width, height }) {
    const popupTop = height === 'full-viewport'
        ? documentBody.top
        : pipe(([target, ref]) => positionMap[verticalPosition](target, ref), (verticalPosition) => clampInterval({ start: documentBody.top + gutter, end: documentBody.bottom - gutter }, verticalPosition))([
            { start: popup.top, end: popup.bottom },
            { start: target.top, end: target.bottom }
        ]).start;
    const { start: popupLeft } = pipe(([target, ref]) => positionMap[horizontalPosition](target, ref), (horizontalPosition) => clampInterval({ start: documentBody.left + gutter, end: documentBody.right - gutter }, horizontalPosition))([
        { start: popup.left, end: popup.right },
        { start: target.left, end: target.right }
    ]);
    const minWidthDecl = width === 'target-width' ? `min-width:${Math.round(target.width)}px;` : '';
    const heightDecl = height === 'full-viewport' ? `height:${Math.round(documentBody.height)}px;` : '';
    const positionDecl = `transform:translate3d(${Math.round(popupLeft)}px,${Math.round(popupTop)}px,0);`;
    return `opacity:1;${positionDecl}${minWidthDecl}${heightDecl}`;
}
//# sourceMappingURL=get-css-text-of-popup-relative-to-target.js.map