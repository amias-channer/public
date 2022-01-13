import * as React from 'react';
import useElementSize, {ElementSize} from 'frontend-core/dist/hooks/use-element-size';
import {Point} from '../../../models/chart';

export enum TooltipPosition {
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top'
}
export interface SvgTooltipProps extends React.SVGProps<SVGPathElement> {
    className?: string;
    content: string | number;
    contentClassName?: string;
    onTooltipSizeUpdate?: (elementSize: ElementSize) => void;
    position: TooltipPosition;
    horizontalPadding?: number;
    pointerSize: number;
    pointerTip: Point;
    verticalPadding?: number;
}
const {useEffect, useRef} = React;
const SvgTooltip: React.FunctionComponent<SvgTooltipProps> = ({
    className = '',
    content,
    contentClassName = '',
    onTooltipSizeUpdate,
    position,
    horizontalPadding = 4,
    pointerSize,
    pointerTip,
    verticalPadding = 4,
    ...domProps
}) => {
    const {x, y}: Point = pointerTip;
    const drawingDirectionCoefficient: number =
        position === TooltipPosition.LEFT || position === TooltipPosition.BOTTOM ? 1 : -1;
    const textBoxRef = useRef<SVGTextElement>(null);
    const textBoxSize: ElementSize = useElementSize(textBoxRef) || {width: 0, height: 0};
    const height: number = textBoxSize.height + 2 * verticalPadding;
    const width: number = textBoxSize.width + 2 * horizontalPadding;
    const isHorizontallyPositioned: boolean = position === TooltipPosition.LEFT || position === TooltipPosition.RIGHT;
    const pointCoordinates: string[] = isHorizontallyPositioned
        ? [
              `${x} ${y}`,
              `${-pointerSize * drawingDirectionCoefficient} ${pointerSize * drawingDirectionCoefficient}`,
              `0 ${(height / 2 - pointerSize) * drawingDirectionCoefficient}`,
              `${-width * drawingDirectionCoefficient} 0`,
              `0 ${-height * drawingDirectionCoefficient}`,
              `${width * drawingDirectionCoefficient} 0`,
              `0 ${(height / 2 - pointerSize) * drawingDirectionCoefficient}`
          ]
        : [
              `${x} ${y}`,
              `${pointerSize * drawingDirectionCoefficient} ${pointerSize * drawingDirectionCoefficient}`,
              `${(width / 2 - pointerSize) * drawingDirectionCoefficient} 0`,
              `0 ${height * drawingDirectionCoefficient}`,
              `${-width * drawingDirectionCoefficient} 0`,
              `0 ${-height * drawingDirectionCoefficient}`,
              `${(width / 2 - pointerSize) * drawingDirectionCoefficient} 0`
          ];
    const verticalOffset: number =
        (textBoxSize.height / 2 + pointerSize + verticalPadding) * drawingDirectionCoefficient;
    const horizontalOffset: number =
        (pointerSize + textBoxSize.width / 2 + horizontalPadding) * -drawingDirectionCoefficient;
    const textStartingPoint = {
        x: [TooltipPosition.BOTTOM, TooltipPosition.TOP].includes(position) ? x : x + horizontalOffset,
        y: [TooltipPosition.LEFT, TooltipPosition.RIGHT].includes(position) ? y : y + verticalOffset
    };

    useEffect(() => {
        onTooltipSizeUpdate?.({
            width: isHorizontallyPositioned ? width + pointerSize : width,
            height: isHorizontallyPositioned ? height : height + pointerSize
        });
    }, [onTooltipSizeUpdate, height, isHorizontallyPositioned, pointerSize, width]);

    return (
        <g data-name="tooltip">
            <path className={className} d={`M ${pointCoordinates.join(' l ')}`} {...domProps} />
            <text
                ref={textBoxRef}
                text-anchor="middle"
                dominant-baseline="central"
                className={contentClassName}
                x={textStartingPoint.x}
                y={textStartingPoint.y}>
                {content}
            </text>
        </g>
    );
};

export default React.memo(SvgTooltip);
