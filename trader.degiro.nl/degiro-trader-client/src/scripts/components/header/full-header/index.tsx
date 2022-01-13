import * as React from 'react';
import HelpMenu from '../../helpcenter/help-menu';
import CashOrderMenu from '../../order/cash-order-menu';
import PlaceOrderMenu from '../../order/place-order-menu';
import QuickSearchPanel from '../../quick-search/panel';
import {header, buttonsGroup, productsSearchLayout} from './full-header.css';

const FullHeader: React.FunctionComponent = () => (
    <div className={header} data-name="fullHeader">
        <div className={productsSearchLayout}>
            <QuickSearchPanel />
        </div>
        <div className={buttonsGroup}>
            <HelpMenu />
            <CashOrderMenu />
            <PlaceOrderMenu />
        </div>
    </div>
);

export default React.memo(FullHeader);
