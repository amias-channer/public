export const DISCOUNT_BAROMETER_FETCH_CONTENT = 'DiscountBarometer/DISCOUNT_BAROMETER_PAGE_FETCH_CONTENT';
export const DISCOUNT_BAROMETER_GOT_CONTENT = 'DiscountBarometer/DISCOUNT_BAROMETER_PAGE_GOT_CONTENT';
export const DISCOUNT_BAROMETER_WILL_UNMOUNT = 'DiscountBarometer/DISCOUNT_BAROMETER_PAGE_WILL_UNMOUNT';

export function discountBarometerFetchContent() {
  return {
    type: DISCOUNT_BAROMETER_FETCH_CONTENT,
  };
}

export function discountBarometerGotContent(data) {
  return {
    type: DISCOUNT_BAROMETER_GOT_CONTENT,
    data,
  };
}
export function discountBarometerWillUnmount() {
  return {
    type: DISCOUNT_BAROMETER_WILL_UNMOUNT,
  };
}
