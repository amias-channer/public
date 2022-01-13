import global from '../scss/global.scss';

const mediaQueries = {
  mobile: `screen and (min-width: ${global.mediaQueryMobileBreakpoint})`,
  mobileOnly: `screen and (max-width: ${global.mediaQueryMaxMobileBreakpoint})`,
  tablet: `screen and (min-width: ${global.mediaQueryTabletBreakpoint})`,
  tabletOnly: `screen and (min-width: ${global.mediaQueryTabletBreakpoint}) and (max-width: ${global.mediaQueryMaxTabletBreakpoint})`,
  mobileTabletOnly: `screen and (max-width: ${global.mediaQueryMaxTabletBreakpoint})`,
  notebook: `screen and (min-width: ${global.mediaQueryNotebookBreakpoint})`,
  notebookOnly: `screen and (min-width: ${global.mediaQueryNotebookBreakpoint}) and (max-width: ${global.mediaQueryMaxNotebookBreakpoint})`,
  tabletNotebookOnly: `screen and (min-width: ${global.mediaQueryTabletBreakpoint}) and (max-width: ${global.mediaQueryMaxNotebookBreakpoint})`,
  desktop: `(min-width: ${global.mediaQueryDesktopBreakpoint})`,
  desktopOnly: `(min-width: ${global.mediaQueryDesktopBreakpoint})`,
};

export default mediaQueries;
