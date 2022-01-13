import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../../../app-component/app-context';
import PopupHintButton from '../../../../popup-button/popup-hint-button';
import CardHeader from '../../../../card/header';
import {
    MeasureCodes,
    Section,
    SectionTypes,
    UnifiedEstimates,
    sortedSections
} from '../../../../../models/analyst-views';
import PopupContent from './popup-content';

interface Props {
    productEstimates?: UnifiedEstimates;
}

export interface VisibleSections {
    sectionTypes: SectionTypes[];
    measureCodes: MeasureCodes[];
    sectionTypeLabels: Partial<Record<SectionTypes, string>>;
}

const {useContext} = React;
const Header: React.FunctionComponent<Props> = ({productEstimates}) => {
    const i18n = useContext(I18nContext);
    const visibleSections = Object.entries(sortedSections).reduce<VisibleSections>(
        (sections: VisibleSections, [sectionType, measuresCodes]) => {
            const castSectionType = sectionType as SectionTypes;
            const sectionData: Section | undefined = productEstimates?.sections[castSectionType];

            if (!sectionData?.measures) {
                return sections;
            }

            measuresCodes.forEach((code: MeasureCodes) => {
                if (sectionData.measures[code]) {
                    sections.measureCodes.push(code);

                    if (!sections.sectionTypes.includes(castSectionType)) {
                        sections.sectionTypes.push(castSectionType);
                    }
                }
            });

            sections.sectionTypeLabels[castSectionType] = productEstimates?.sections[castSectionType]?.type;

            return sections;
        },
        {sectionTypes: [], measureCodes: [], sectionTypeLabels: {}}
    );

    return (
        <CardHeader
            title={
                <>
                    {localize(i18n, 'trader.productDetails.analystViews.estimations.title')}
                    {isTouchDevice() && visibleSections.sectionTypes.length > 0 && (
                        <PopupHintButton title={localize(i18n, 'trader.productDetails.analystViews.estimations.title')}>
                            <PopupContent visibleSections={visibleSections} />
                        </PopupHintButton>
                    )}
                </>
            }
        />
    );
};

export default React.memo(Header);
