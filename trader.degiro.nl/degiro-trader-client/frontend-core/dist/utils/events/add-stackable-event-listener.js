export default function addStackableEventListener(element, eventType) {
    let stack = [];
    const eventHandler = (event) => {
        const handler = stack.find(([_, predicate]) => predicate(event));
        handler === null || handler === void 0 ? void 0 : handler[0](event);
    };
    element.addEventListener(eventType, eventHandler);
    return (handler, predicate = (_e) => true) => {
        const handlerTuple = [handler, predicate];
        stack.unshift(handlerTuple);
        return () => {
            stack = stack.filter((stackTuple) => stackTuple !== handlerTuple);
        };
    };
}
// Predefined listeners
export const addDocumentKeydownStackableEventListener = addStackableEventListener(document, 'keydown');
//# sourceMappingURL=add-stackable-event-listener.js.map