import * as DomPurify from 'dompurify';
const allowedTags = [
    'table',
    'thead',
    'tfoot',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'ul',
    'ol',
    'li',
    'br',
    'p',
    'div',
    'b',
    'u',
    'i',
    's',
    'ul',
    'li',
    'div',
    'span'
];
const allowedAttrs = ['href', 'target', 'download', 'title', 'name', 'class'];
DomPurify.setConfig({
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs,
    FORBID_TAGS: [],
    FORBID_ATTR: []
});
// eslint-disable-next-line prefer-destructuring
const sanitize = DomPurify.sanitize;
export default sanitize;
//# sourceMappingURL=sanitize.js.map