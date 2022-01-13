import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import Select, {SelectOption} from 'frontend-core/dist/components/ui-trader4/select';
import {filtersMediumLayout} from '../../media-queries';
import {Routes} from '../../navigation';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import ExportButton from '../filters/export-button';
import {portfolioFilters} from './portfolio.css';
import {PositionType, PositionTypeIds} from './position-types';

export interface PortfolioFiltersData {
    orderBy: string;
}

interface PortfolioFiltersProps {
    positionTypes: PositionType[];
    positionType: PositionType;
}

const {useCallback, useContext, useMemo} = React;
const PortfolioFilters = React.memo<PortfolioFiltersProps>(({positionTypes, positionType}) => {
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const {reportingUrl} = useContext(ConfigContext);
    const history = useHistory();
    const hasSmallLayout = !useMediaQuery(filtersMediumLayout);
    const positionOptions = useMemo(
        () =>
            positionTypes.map(
                (positionType: PositionType): SelectOption<PositionTypeIds> => ({
                    value: positionType.id,
                    label: localize(i18n, positionType.translation)
                })
            ),

        [positionTypes, i18n]
    );
    const onPositionTypeChange = useCallback((id: PositionTypeIds) => history.push(`${Routes.PORTFOLIO}/${id}`), []);

    return (
        <div className={portfolioFilters}>
            {currentClient.canFilterPortfolioPositions && (
                <Select<PositionTypeIds>
                    selectedOption={positionType && positionOptions.find(({value}) => positionType.id === value)}
                    onChange={onPositionTypeChange}
                    options={positionOptions}
                />
            )}
            {reportingUrl && (
                <ExportButton collapsed={hasSmallLayout} reportBaseUrl={`${reportingUrl}v3/positionReport/`} />
            )}
        </div>
    );
});

PortfolioFilters.displayName = 'PortfolioFilters';

export default PortfolioFilters;
