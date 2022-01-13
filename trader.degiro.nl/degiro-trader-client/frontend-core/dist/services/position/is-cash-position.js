import { PositionTypes } from '../../models/product';
export default function isCashPosition(position) {
    return position.positionType === PositionTypes.CASH;
}
//# sourceMappingURL=is-cash-position.js.map