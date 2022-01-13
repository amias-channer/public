import * as React from 'react';
import ProductDetailsHint from '../product-details-hint';
import {label as labelClassName, valueItem, openedTooltip, tooltipButton, cardRow} from './card-row-with-tooltip.css';
import {fullWidthValueItem, inlineEndValueItem, lineSection} from '../../../../styles/details-overview.css';

type Props = React.PropsWithChildren<{
    label?: string;
    tooltip?: React.ReactNode;
    className?: string;
    valueClassName?: string;
}>;

const CardRowWithTooltip: React.VoidFunctionComponent<Props> = ({
    label,
    tooltip,
    children,
    className = lineSection,
    valueClassName = ''
}) => (
    <div className={`${cardRow} ${className}`}>
        {label && (
            <dt className={labelClassName}>
                {label}
                {tooltip && (
                    <ProductDetailsHint className={tooltipButton} activeClassName={openedTooltip} tooltip={tooltip} />
                )}
            </dt>
        )}
        {children && (
            <dd className={`${valueItem} ${inlineEndValueItem} ${valueClassName} ${label ? '' : fullWidthValueItem}`}>
                {children}
            </dd>
        )}
    </div>
);

export default React.memo(CardRowWithTooltip);
