import {Position} from 'frontend-core/dist/models/product';
import isCashPosition from 'frontend-core/dist/services/position/is-cash-position';
import isJointCashPosition from 'frontend-core/dist/services/position/is-joint-cash-position';

export default function getPositionProductLinkId(position: Position): number | string | undefined {
    if (isCashPosition(position) || isJointCashPosition(position)) {
        return;
    }

    return position.productInfo.id;
}
