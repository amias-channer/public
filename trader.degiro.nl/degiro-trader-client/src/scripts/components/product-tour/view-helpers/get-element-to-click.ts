export default function getElementToClick(contextElement: HTMLElement | null): HTMLElement | null {
    return contextElement && contextElement.querySelector<HTMLElement>('[data-name="totalPortfolioToggle"]');
}
