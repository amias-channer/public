export const appWorkspaceElementId = 'appWorkspace';

export default function getAppWorkspace(): HTMLElement | null {
    return document.getElementById(appWorkspaceElementId);
}
