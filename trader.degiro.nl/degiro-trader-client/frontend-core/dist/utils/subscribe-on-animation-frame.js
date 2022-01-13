export default function subscribeOnAnimationFrame(callback) {
    let frameRequestId;
    let onFrame = (time) => {
        callback(time);
        frameRequestId = requestAnimationFrame(onFrame);
    };
    frameRequestId = requestAnimationFrame(onFrame);
    return () => {
        cancelAnimationFrame(frameRequestId);
        // @ts-ignore TS2322
        onFrame = undefined;
    };
}
//# sourceMappingURL=subscribe-on-animation-frame.js.map