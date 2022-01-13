import {Position} from 'frontend-core/dist/models/product';

export interface PositionType {
    id: PositionTypeIds;
    translation: string;
}

export enum PositionTypeIds {
    ACTIVE = 'active',
    ALL = 'all',
    INACTIVE = 'inactive'
}

export const positionTypes: PositionType[] = [
    {
        id: PositionTypeIds.ACTIVE,
        translation: 'trader.portfolio.positionTypes.active'
    },
    {
        id: PositionTypeIds.INACTIVE,
        translation: 'trader.portfolio.positionTypes.inactive'
    },
    {
        id: PositionTypeIds.ALL,
        translation: 'trader.portfolio.positionTypes.all'
    }
];

export function testPositionType(positionType: PositionType, position: Position): boolean {
    if (positionType.id === PositionTypeIds.ACTIVE) {
        return Boolean(position.isActive);
    }

    if (positionType.id === PositionTypeIds.INACTIVE) {
        return !position.isActive;
    }

    return true;
}
