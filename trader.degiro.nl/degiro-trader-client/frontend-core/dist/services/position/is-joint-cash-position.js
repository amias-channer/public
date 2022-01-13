import { PositionTypes } from '../../models/product';
export default function isJointCashPosition(position) {
    return position.positionType === PositionTypes.JOINT_CASH;
}
//# sourceMappingURL=is-joint-cash-position.js.map