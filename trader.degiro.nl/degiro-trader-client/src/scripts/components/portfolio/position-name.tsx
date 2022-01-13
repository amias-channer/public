import {Position} from 'frontend-core/dist/models/product';
import {UserCashFund} from 'frontend-core/dist/models/user';
import getPrimaryCashFundByProductId from 'frontend-core/dist/services/cash-fund/get-primary-cash-fund-by-product-id';
import isJointCashPosition from 'frontend-core/dist/services/position/is-joint-cash-position';
import * as React from 'react';
import {CurrentClientContext} from '../app-component/app-context';
import ProductName from '../product-name/index';

interface Props {
    position: Position;
    className?: string;
}

const {useContext} = React;
const PositionName: React.FunctionComponent<Props> = ({position, className}) => {
    const currentClient = useContext(CurrentClientContext);
    const {productInfo} = position;

    if (!productInfo) {
        return null;
    }

    const productCashFund: UserCashFund | undefined = isJointCashPosition(position)
        ? getPrimaryCashFundByProductId(currentClient, productInfo.currency, productInfo.id)
        : undefined;

    // [WF-2636], Trader3 logic for joint cash fund model
    return (
        <ProductName
            productInfo={productCashFund ? {...productInfo, name: productCashFund.name} : productInfo}
            className={className}
        />
    );
};

export default React.memo(PositionName);
