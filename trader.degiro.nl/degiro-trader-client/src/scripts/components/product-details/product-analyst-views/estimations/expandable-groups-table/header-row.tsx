import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {CompactLabels} from '../index';
import {
    inlineEndContentCell,
    row,
    startStickyCellShadowedContent,
    stickyCellContent
} from '../../../../table/table.css';
import {
    collapsedCell,
    compactHeaderColumn,
    headerCell,
    inlineCenterContentCell,
    lastGroupedCell,
    startStickyCellWithoutBorder
} from '../estimations.css';
import {I18nContext} from '../../../../app-component/app-context';
import {nbsp} from '../../../../value';

interface Props {
    label: string;
    annualGroupLabels: string[];
    interimGroupLabels: string[];
    interimGroupCompactLabels: CompactLabels;
    annualGroupCompactLabels: CompactLabels;
    hasCompactLayout: boolean;
    hasOneColumnLayout: boolean;
    isInterimGroupExpanded: boolean;
    isAnnualGroupExpanded: boolean;
    stickyHeaderCellRef: React.RefObject<HTMLTableHeaderCellElement>;
}

const {useContext} = React;
const HeaderRow: React.FunctionComponent<Props> = ({
    label,
    annualGroupLabels,
    interimGroupLabels,
    interimGroupCompactLabels,
    annualGroupCompactLabels,
    hasOneColumnLayout,
    hasCompactLayout,
    isInterimGroupExpanded,
    isAnnualGroupExpanded,
    stickyHeaderCellRef
}) => {
    const i18n = useContext(I18nContext);
    const renderPeriodHeaderCells = (labels: string[], isExpanded: boolean): React.ReactNode => (
        <>
            {labels.map((label: string, index: number) => {
                const isCellCollapsable: boolean = hasCompactLayout && !(index === 0 || index === labels.length - 1);

                return (
                    <th
                        key={`${label}-${index}`}
                        className={`${headerCell} ${inlineEndContentCell} ${
                            isCellCollapsable && !isExpanded ? collapsedCell : ''
                        }`}>
                        {label}
                    </th>
                );
            })}
            <th className={`${headerCell} ${inlineEndContentCell} ${lastGroupedCell}`}>
                {localize(i18n, 'trader.productDetails.analystViews.estimations.graph')}
            </th>
        </>
    );
    const renderCompactHeaderCell = ([startLabel, endLabel]: CompactLabels): React.ReactNode => (
        <th className={`${headerCell} ${inlineCenterContentCell} ${lastGroupedCell}`}>
            {startLabel}
            {`${nbsp} - ${nbsp}`}
            {endLabel}
        </th>
    );

    return (
        <tr className={row}>
            <th
                className={`${headerCell} ${
                    hasOneColumnLayout ? compactHeaderColumn : ''
                } ${startStickyCellWithoutBorder}`}
                ref={stickyHeaderCellRef}>
                <div className={`${stickyCellContent} ${startStickyCellShadowedContent}`}>{label}</div>
            </th>
            {isNonEmptyArray(omitNullable(interimGroupCompactLabels)) &&
                hasOneColumnLayout &&
                !isInterimGroupExpanded &&
                renderCompactHeaderCell(interimGroupCompactLabels)}
            {interimGroupLabels.length > 0 &&
                (!hasOneColumnLayout || isInterimGroupExpanded) &&
                renderPeriodHeaderCells(interimGroupLabels, isInterimGroupExpanded)}
            {isNonEmptyArray(omitNullable(annualGroupCompactLabels)) &&
                hasOneColumnLayout &&
                !isAnnualGroupExpanded &&
                renderCompactHeaderCell(annualGroupCompactLabels)}
            {annualGroupLabels.length > 0 &&
                (!hasOneColumnLayout || isAnnualGroupExpanded) &&
                renderPeriodHeaderCells(annualGroupLabels, isAnnualGroupExpanded)}
        </tr>
    );
};

export default React.memo(HeaderRow);
