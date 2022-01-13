/**
 * @description deactivate the active control on the page.
 *  It's helpful on mobile devices when we need to force a keyboard closing
 */
export default function deactivateActiveElement() {
    var _a, _b;
    (_b = (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur) === null || _b === void 0 ? void 0 : _b.call(_a);
}
//# sourceMappingURL=deactivate-active-element.js.map