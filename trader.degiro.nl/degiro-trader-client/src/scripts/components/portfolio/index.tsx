import useAsync from 'frontend-core/dist/hooks/use-async';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {ProductType} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {useParams} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import getPositionGroupTypes from '../../services/portfolio/get-position-group-types';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import Alerts from '../inbox/alerts/index';
import Page from '../page/index';
import PageWrapper from '../page/page-wrapper';
import {pageHeaderTitle} from '../page/page.css';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert/index';
import Spinner from '../progress-bar/spinner';
import CashFundCompensations from './cash-fund-compensations';
import CorporateActions from './corporate-actions';
import PortfolioFilters from './filters';
import {emptyPortfolioMessage, emptyPortfolioMessageOnGlobalCompactLayout, preloaderLayout} from './portfolio.css';
import {PositionType, PositionTypeIds, positionTypes} from './position-types';
import Positions from './positions';
import Card from '../card';
import CardHeader from '../card/header';
import useNavigationThroughElementsByKeys from '../../hooks/use-navigation-through-elements-by-keys';
import useJumpFromOneSectionToAnotherByPressingKey from '../../hooks/use-jump-from-one-section-to-another-by-pressing-key';

const {useState, useEffect, useContext, useRef} = React;
const Portfolio: React.FunctionComponent = () => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const {canFilterPortfolioPositions} = currentClient;
    const {type: positionTypeParam} = useParams<{type?: string}>();
    const pageTitle: string = localize(i18n, 'trader.navigation.portfolio');
    const {value: productTypes = []} = useAsync(() => getPositionGroupTypes(config), [config]);
    const [positionType, setPositionType] = useState<PositionType | undefined>();

    useEffect(() => {
        // show always all positions
        const showAllPositions: boolean = !canFilterPortfolioPositions;
        const newPositionType: PositionType =
            positionTypes.find(({id}) => (showAllPositions ? id === PositionTypeIds.ALL : positionTypeParam === id)) ||
            positionTypes[0];

        if (positionType?.id !== newPositionType.id) {
            setPositionType(newPositionType);
        }
    }, [canFilterPortfolioPositions, positionTypeParam]);

    useDocumentTitle(pageTitle);

    // Keyboard navigation
    const positionsRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);

    useJumpFromOneSectionToAnotherByPressingKey(filtersRef, positionsRef);
    useJumpFromOneSectionToAnotherByPressingKey(positionsRef, filtersRef);
    useNavigationThroughElementsByKeys(positionsRef);

    return (
        <PageWrapper data-name="portfolio">
            <OpenedTasksAlert />
            <Alerts />
            <Page>
                <Card
                    innerHorizontalGap={false}
                    header={
                        <div ref={filtersRef}>
                            <CardHeader>
                                <h1 className={pageHeaderTitle}>{pageTitle}</h1>
                                {positionType && (
                                    <PortfolioFilters positionType={positionType} positionTypes={positionTypes} />
                                )}
                            </CardHeader>
                        </div>
                    }>
                    <div ref={positionsRef}>
                        {positionType &&
                            productTypes.map((productType: ProductType) => (
                                <Positions
                                    key={`${productType.id};${positionType.id}`}
                                    positionType={positionType}
                                    productType={productType}
                                />
                            ))}
                        <Spinner layoutClassName={preloaderLayout} />
                        {productTypes[0] && (
                            <div
                                data-id="emptyPortfolio"
                                className={`${emptyPortfolioMessage} ${
                                    hasGlobalFullLayout ? '' : emptyPortfolioMessageOnGlobalCompactLayout
                                }`}>
                                {localize(i18n, 'trader.portfolio.noPositions')}
                            </div>
                        )}
                    </div>
                    <CashFundCompensations />
                    <CorporateActions />
                </Card>
            </Page>
        </PageWrapper>
    );
};

export default React.memo(Portfolio);
