import * as React from 'react';
import Accordion, {AccordionItemId} from '../../../../accordion';
import AccordionItem from '../../../../accordion/accordion-item';
import {productDetailsTooltipContent} from '../../../product-details.css';
import estimationsTooltips from '../../../tooltips-data/refinitiv-analyst-views-estimations-tooltips';
import {MeasureCodes, SectionTypes, sortedSections} from '../../../../../models/analyst-views';
import {accordionHeader} from '../estimations.css';
import {VisibleSections} from '../header';

interface Props {
    visibleSections: VisibleSections;
}

const initialOpenedAccordionItemIds: AccordionItemId[] = ['0'];
const PopupContent: React.FunctionComponent<Props> = ({visibleSections}) => (
    <>
        {Object.entries(sortedSections).map(
            ([sectionType, measuresCodes], sectionTypeIndex: number) =>
                visibleSections.sectionTypes.includes(sectionType as SectionTypes) && (
                    <React.Fragment key={`sectionType-${sectionType}`}>
                        <div className={accordionHeader}>
                            {visibleSections.sectionTypeLabels[sectionType as SectionTypes]}
                        </div>
                        <Accordion
                            initialOpenedItemIds={sectionTypeIndex === 0 ? initialOpenedAccordionItemIds : undefined}>
                            {({toggle, openedItemIds}) =>
                                measuresCodes.map((code: MeasureCodes, index: number) => {
                                    const id: string = index.toString();

                                    return visibleSections.measureCodes.includes(code) ? (
                                        <AccordionItem
                                            header={estimationsTooltips[code].label}
                                            isOpened={openedItemIds.includes(id)}
                                            onToggle={toggle.bind(null, id)}>
                                            <dl>
                                                <dd className={productDetailsTooltipContent}>
                                                    {estimationsTooltips[code].content}
                                                </dd>
                                            </dl>
                                        </AccordionItem>
                                    ) : null;
                                })
                            }
                        </Accordion>
                    </React.Fragment>
                )
        )}
    </>
);

export default React.memo(PopupContent);
