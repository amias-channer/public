function addEventListener(el, type, listener, options) {
    const elList = Array.isArray(el) ? el : [el];
    elList.forEach((el) => el.addEventListener(type, listener, options));
    return () => elList.forEach((el) => el.removeEventListener(type, listener, options));
}
export default addEventListener;
//# sourceMappingURL=add-event-listener.js.map