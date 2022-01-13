import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import PanelHeader from '../../app-component/side-information-panel/header';
import {content, contentLayout} from '../../app-component/side-information-panel/side-information-panel.css';
import {filtersLayout} from './filters-layout.css';

export interface FiltersLayoutApi {
    openFiltersForm(): void;
    closeFiltersForm(): void;
}

interface Props {
    'data-name'?: string;
    children(api: FiltersLayoutApi): React.ReactNode;
    renderFiltersForm?: (api: FiltersLayoutApi) => React.ReactNode;
}

const {useContext, memo} = React;
const FiltersLayout = memo<Props>(({children, renderFiltersForm, 'data-name': dataName}) => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const closeFiltersForm: FiltersLayoutApi['closeFiltersForm'] = app.closeSideInformationPanel;
    const openFiltersForm: FiltersLayoutApi['openFiltersForm'] = () =>
        app.openSideInformationPanel({
            content: (
                <div className={contentLayout}>
                    <PanelHeader onAction={closeFiltersForm}>{localize(i18n, 'trader.filters.title')}</PanelHeader>
                    <div className={content}>{renderFiltersForm?.({openFiltersForm, closeFiltersForm})}</div>
                </div>
            )
        });

    return (
        <div className={filtersLayout} data-name={dataName}>
            {children({openFiltersForm, closeFiltersForm})}
        </div>
    );
});

FiltersLayout.displayName = 'FiltersLayout';
export default FiltersLayout;
