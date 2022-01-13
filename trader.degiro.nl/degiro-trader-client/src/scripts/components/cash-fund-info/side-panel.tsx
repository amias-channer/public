import * as React from 'react';
import {line} from '../../../styles/details-overview.css';
import PanelHeader from '../app-component/side-information-panel/header';
import {productName} from '../app-component/side-information-panel/product-details/product-details.css';
import {content, contentLayout} from '../app-component/side-information-panel/side-information-panel.css';
import ProductName from '../product-name/index';
import CashFundInfo, {CashFundInfoProps} from './index';

interface SidePanelCashFundInfoProps extends CashFundInfoProps {
    title: React.ReactNode;
    onClose(): void;
}

const SidePanelCashFundInfo: React.FunctionComponent<SidePanelCashFundInfoProps> = ({
    title,
    productInfo,
    onClose,
    ...restCashFundProps
}) => (
    <div data-name="cashFundInfo" className={contentLayout}>
        <PanelHeader onAction={onClose}>{title}</PanelHeader>
        <div className={content}>
            {productInfo && (
                <div className={line}>
                    <ProductName productInfo={productInfo} className={productName} />
                </div>
            )}
            <CashFundInfo {...restCashFundProps} productInfo={productInfo} />
        </div>
    </div>
);

export default React.memo(SidePanelCashFundInfo);
