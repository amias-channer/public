import addEventListener from './add-event-listener';
export default function addEventListenersOutside(refs, eventName, callback, options = {}) {
    const handler = (event) => {
        const target = event.target;
        const isTargetOutsideRefs = refs.every((node) => {
            if (node === null) {
                return true;
            }
            if (typeof node === 'string') {
                return !Array.from(document.querySelectorAll(node)).some((node) => node.contains(target));
            }
            return !node.contains(target);
        });
        if (isTargetOutsideRefs) {
            callback(event);
        }
    };
    return addEventListener(document, eventName, handler, options);
}
//# sourceMappingURL=add-event-listeners-outside.js.map