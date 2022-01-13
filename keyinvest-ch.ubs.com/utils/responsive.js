import global from '../scss/global.scss';

export const DESKTOP_MODE = 'desktop';
export const NOTEBOOK_MODE = 'notebook';
export const TABLET_MODE = 'tablet';
export const MOBILE_MODE = 'mobile';

export const convertPxToFloat = (pxString) => Number.parseFloat(pxString.slice(0, -2));

const scssBreakpoints = {
  mediaQueryMaxMobileBreakpoint: convertPxToFloat(`${global.mediaQueryMaxMobileBreakpoint}`),
  mediaQueryTabletBreakpoint: convertPxToFloat(`${global.mediaQueryTabletBreakpoint}`),
  mediaQueryMaxTabletBreakpoint: convertPxToFloat(`${global.mediaQueryMaxTabletBreakpoint}`),
  mediaQueryNotebookBreakpoint: convertPxToFloat(`${global.mediaQueryNotebookBreakpoint}`),
  mediaQueryMaxNotebookBreakpoint: convertPxToFloat(`${global.mediaQueryMaxNotebookBreakpoint}`),
};

export const getResponsiveModeByScreenWidth = (
  screenWidth = window.innerWidth, breakpoints = scssBreakpoints,
) => {
  if (screenWidth <= breakpoints.mediaQueryMaxMobileBreakpoint) {
    return MOBILE_MODE;
  }
  if (screenWidth >= breakpoints.mediaQueryTabletBreakpoint
    && screenWidth <= breakpoints.mediaQueryMaxTabletBreakpoint) {
    return TABLET_MODE;
  }
  if (screenWidth >= breakpoints.mediaQueryNotebookBreakpoint
    && screenWidth <= breakpoints.mediaQueryMaxNotebookBreakpoint) {
    return NOTEBOOK_MODE;
  }
  return DESKTOP_MODE;
};

export const checkComponentRenderStatus = (visibilityData, currentResponsiveMode) => {
  if (visibilityData) {
    switch (currentResponsiveMode) {
      case MOBILE_MODE:
        return typeof visibilityData[MOBILE_MODE] === 'undefined' || visibilityData[MOBILE_MODE] === true;
      case TABLET_MODE:
        return typeof visibilityData[TABLET_MODE] === 'undefined' || visibilityData[TABLET_MODE] === true;
      case NOTEBOOK_MODE:
        return typeof visibilityData[NOTEBOOK_MODE] === 'undefined' || visibilityData[NOTEBOOK_MODE] === true;
      case DESKTOP_MODE:
        return typeof visibilityData[DESKTOP_MODE] === 'undefined' || visibilityData[DESKTOP_MODE] === true;
      default:
        break;
    }
  }
  return true;
};

export const isMobileMode = (responsiveMode) => responsiveMode === MOBILE_MODE;
export const isTabletMode = (responsiveMode) => responsiveMode === TABLET_MODE;
