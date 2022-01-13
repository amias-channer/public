import { pathOr } from 'ramda';

// Image
export const getImageAltDescription = (data) => pathOr('', ['items', 'image-alt'])(data);
export const getImageSrc = (data) => pathOr('', ['items', 'image'])(data);

// Pdf
export const getPdfOneTitle = (data) => pathOr('', ['items', 'pdf-one-title'])(data);
export const getPdfOneSrc = (data) => pathOr('', ['items', 'pdf-one'])(data);

export const getPdfTwoTitle = (data) => pathOr('', ['items', 'pdf-two-title'])(data);
export const getPdfTwoSrc = (data) => pathOr('', ['items', 'pdf-two'])(data);

// Buttons
export const getOpenButtonOneInNewTab = (data) => pathOr('0', ['items', 'button-one-new-tab'])(data);
export const getOpenMobileButtonOneInNewTab = (data) => pathOr('0', ['items', 'button-one-mobile-open-in-new-window'])(data);
export const getButtonOneSrc = (data) => pathOr('', ['items', 'button-one-url'])(data);
export const getMobileButtonOneSrc = (data) => pathOr('', ['items', 'button-one-mobile-url'])(data);

export const getButtonOneText = (data) => pathOr('', ['items', 'button-one-text'])(data);
export const getButtonOneDescription = (data) => pathOr('', ['items', 'button-one-alternative-description'])(data);

export const getMobileButtonOneText = (data) => pathOr('', ['items', 'button-one-mobile-text'])(data);
export const getMobileButtonOneDescription = (data) => pathOr('', ['items', 'button-one-mobile-description'])(data);

export const getOpenButtonTwoInNewTab = (data) => pathOr('0', ['items', 'button-two-new-tab'])(data);
export const getOpenMobileButtonTwoInNewTab = (data) => pathOr('0', ['items', 'button-two-mobile-open-in-new-window'])(data);

export const getButtonTwoSrc = (data) => pathOr('', ['items', 'button-two-url'])(data);
export const getMobileButtonTwoSrc = (data) => pathOr('', ['items', 'button-two-mobile-url'])(data);

export const getButtonTwoText = (data) => pathOr('', ['items', 'button-two-text'])(data);
export const getButtonTwoDescription = (data) => pathOr('', ['items', 'button-two-alternative-description'])(data);

export const getMobileButtonTwoText = (data) => pathOr('', ['items', 'button-two-mobile-text'])(data);
export const getMobileButtonTwoDescription = (data) => pathOr('', ['items', 'button-two-mobile-description'])(data);
