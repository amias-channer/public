import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {CompactLabels} from '..';
import {I18nContext} from '../../../../app-component/app-context';
import {row, startStickyCellShadowedContent, stickyCellContent} from '../../../../table/table.css';
import {headerCell, expandableButtonsCell, startStickyCellWithoutBorder} from '../estimations.css';
import ExpandableButton from './expandable-button';
import HeaderRow from './header-row';

interface GroupsState {
    isInterimGroupExpanded: boolean;
    isAnnualGroupExpanded: boolean;
}

interface Props {
    headerRowLabel: string;
    annualGroupHeaderLabels: string[];
    interimGroupHeaderLabels: string[];
    interimGroupCompactLabels: CompactLabels;
    annualGroupCompactLabels: CompactLabels;
    children(props: GroupsState): React.ReactNode[];
    className: string;
    hasCompactLayout: boolean;
    hasOneColumnLayout: boolean;
    stickyHeaderCellRef: React.RefObject<HTMLTableHeaderCellElement>;
}

const collapsedColSpan: number = 3;
const visibleCellReservedColSpan: number = 1;
const collapsedCompactColSpan: number = 1;
const {useState, useContext} = React;
const ExpandableGroupsTable: React.FunctionComponent<Props> = ({
    headerRowLabel,
    annualGroupHeaderLabels,
    interimGroupHeaderLabels,
    interimGroupCompactLabels,
    annualGroupCompactLabels,
    children,
    className,
    hasCompactLayout,
    hasOneColumnLayout,
    stickyHeaderCellRef
}) => {
    const i18n = useContext(I18nContext);
    const [isInterimGroupExpanded, setIsInterimGroupExpanded] = useState(false);
    const [isAnnualGroupExpanded, setIsAnnualGroupExpanded] = useState(false);
    const quarterlyLabel: string = localize(i18n, 'trader.productDetails.analystViews.estimations.quarterly');
    const annualLabel: string = localize(i18n, 'trader.productDetails.analystViews.estimations.annual');
    const interimGroupHeaderLabelsCount: number = interimGroupHeaderLabels.length;
    const annualGroupHeaderLabelsCount: number = annualGroupHeaderLabels.length;
    // Checking cases for: only two values or only curr value
    const shouldRenderInterimExpandableButton: boolean = interimGroupHeaderLabelsCount > 2;
    const shouldRenderAnnualExpandableButton: boolean = annualGroupHeaderLabelsCount > 2;

    return (
        <table className={className}>
            <thead>
                {hasCompactLayout && (shouldRenderInterimExpandableButton || shouldRenderAnnualExpandableButton) && (
                    <tr className={row}>
                        {/* Placeholder for Headers Column */}
                        <th className={`${headerCell} ${startStickyCellWithoutBorder}`} ref={stickyHeaderCellRef}>
                            {/* Placeholder for Sticky cell content to use shadow effect on scrolling */}
                            <div className={`${stickyCellContent} ${startStickyCellShadowedContent}`} />
                        </th>
                        {interimGroupHeaderLabelsCount !== 0 && (
                            <th
                                className={expandableButtonsCell}
                                colSpan={
                                    isInterimGroupExpanded
                                        ? interimGroupHeaderLabelsCount + visibleCellReservedColSpan
                                        : hasOneColumnLayout
                                        ? collapsedCompactColSpan
                                        : collapsedColSpan
                                }>
                                {shouldRenderInterimExpandableButton && (
                                    <ExpandableButton
                                        onToggle={setIsInterimGroupExpanded.bind(null, !isInterimGroupExpanded)}
                                        label={quarterlyLabel}
                                        isExpanded={isInterimGroupExpanded}
                                        hasCompactLayout={hasOneColumnLayout}
                                    />
                                )}
                            </th>
                        )}
                        {annualGroupHeaderLabelsCount !== 0 && (
                            <th
                                className={expandableButtonsCell}
                                colSpan={
                                    isAnnualGroupExpanded
                                        ? annualGroupHeaderLabelsCount + visibleCellReservedColSpan
                                        : hasOneColumnLayout
                                        ? collapsedCompactColSpan
                                        : collapsedColSpan
                                }>
                                {shouldRenderAnnualExpandableButton && (
                                    <ExpandableButton
                                        onToggle={setIsAnnualGroupExpanded.bind(null, !isAnnualGroupExpanded)}
                                        label={annualLabel}
                                        isExpanded={isAnnualGroupExpanded}
                                        hasCompactLayout={hasOneColumnLayout}
                                    />
                                )}
                            </th>
                        )}
                    </tr>
                )}
                <HeaderRow
                    label={headerRowLabel}
                    annualGroupLabels={annualGroupHeaderLabels}
                    interimGroupLabels={interimGroupHeaderLabels}
                    interimGroupCompactLabels={interimGroupCompactLabels}
                    annualGroupCompactLabels={annualGroupCompactLabels}
                    hasOneColumnLayout={hasOneColumnLayout}
                    hasCompactLayout={hasCompactLayout}
                    isInterimGroupExpanded={isInterimGroupExpanded}
                    isAnnualGroupExpanded={isAnnualGroupExpanded}
                    stickyHeaderCellRef={stickyHeaderCellRef}
                />
            </thead>
            <tbody>{children({isInterimGroupExpanded, isAnnualGroupExpanded})}</tbody>
        </table>
    );
};

export default React.memo(ExpandableGroupsTable);
