import isString from './is-string';
const regExpEscapeMask = /([.*+?^=!:${}()|[\]/\\])/g;
export default function joinRegExp(patterns, flags) {
    const sources = patterns.reduce((sources, pattern) => {
        if (isString(pattern)) {
            if (pattern) {
                regExpEscapeMask.lastIndex = 0;
                /**
                 * If it's a string, we need to escape it
                 * Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                 */
                sources.push(pattern.replace(regExpEscapeMask, '\\$1'));
            }
        }
        else if (pattern && pattern.source) {
            // If it's a RegExp already, we want to extract the source
            sources.push(pattern.source);
        }
        return sources;
    }, []);
    return new RegExp(sources.join('|'), flags);
}
//# sourceMappingURL=join-reg-exp.js.map