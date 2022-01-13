/**
 * - all values should be aligned with .css files
 * - it's not possible to use `exportTo` from postcss-custom-media, because it generates a file BEFORE Webpack needs it
 */
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';

export const xSmallViewportMinWidth: MediaQueryList = self.matchMedia('(min-width: 361px)');
export const smallViewportMinWidth: MediaQueryList = self.matchMedia('(min-width: 768px)');
export const mediumViewportMinWidth: MediaQueryList = self.matchMedia('(min-width: 1024px)');
export const xMediumViewportMinWidth: MediaQueryList = self.matchMedia('(min-width: 1280px)');
export const largeViewportMinWidth: MediaQueryList = self.matchMedia('(min-width: 1600px)');

export const scrollableTable: MediaQueryList = self.matchMedia('(min-width: 640px)');

export const filtersMediumLayout: MediaQueryList = self.matchMedia('(min-width: 600px)');
export const filtersLargeLayout: MediaQueryList = mediumViewportMinWidth;

export const visibleProductPerformanceChartInList: MediaQueryList = xSmallViewportMinWidth;

export const globalFullLayout: MediaQueryList = isTouchDevice()
    ? xMediumViewportMinWidth
    : self.matchMedia('(min-width: 1115px)');

export const informationPanelSideLayout: MediaQueryList = mediumViewportMinWidth;
