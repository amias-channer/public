/**
 * @description Fixes [WF-2070], [WF-2071]. Username is case-insensitive, side spaces are ignored
 * @param {string|undefined} username
 * @returns {string}
 */
export default function normalizeUserName(username: string | undefined): string {
    return username ? username.trim().toLowerCase() : '';
}
