/**
 * @description VWD sends Bid-/Ask- Price equals -1 as market price
 * @param {number} value
 * @returns {boolean}
 */
export default function isMarketOrderPrice(value: number | null | undefined): boolean {
    return value === -1;
}
