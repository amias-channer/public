export default function escapeRegExp(pattern) {
    return pattern.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}
//# sourceMappingURL=escape-reg-exp.js.map