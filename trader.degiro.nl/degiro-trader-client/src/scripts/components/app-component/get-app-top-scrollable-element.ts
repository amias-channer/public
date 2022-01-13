export const appTopScrollableElementId = 'mainContent';

export default function getAppTopScrollableElement(): HTMLElement {
    return document.getElementById(appTopScrollableElementId) as HTMLElement;
}
