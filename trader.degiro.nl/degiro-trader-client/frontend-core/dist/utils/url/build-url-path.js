export default function buildUrlPath(params) {
    const parts = Object.entries(params).reduce((parts, [key, value]) => {
        if (value || value === false || value === 0) {
            parts.push(key, value);
        }
        else if (value === '') {
            parts.push(key);
        }
        return parts;
    }, []);
    return parts.length ? `/${parts.join('/')}/` : '/';
}
//# sourceMappingURL=build-url-path.js.map