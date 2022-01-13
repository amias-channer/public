function pipe(...fns) {
    return (p) => fns.reduce((acc, cur) => cur(acc), p);
}
export default pipe;
//# sourceMappingURL=pipe.js.map