import {PriceAlert} from '../../models/price-alert';

export default function getPositionTypeLabel(priceAlert: PriceAlert): string {
    return priceAlert.positionSize < 0
        ? 'trader.portfolioDepreciation.positionTypes.short'
        : 'trader.portfolioDepreciation.positionTypes.long';
}
