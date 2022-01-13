// TODO: move formatting and post-processing to BE
export default function formatLinkContent(content: string): string {
    const linkRegExp = /https?:\/\/[^\s<>]+/gim;
    const phoneNumberRegExp = /[+\d()]+[-+#*\d()\s]{6,}\d/gim;
    const emailRegExp = /[^\s<>]+@\S+\.\w+/gim;
    const separator = new RegExp(`(${linkRegExp.source})|(${phoneNumberRegExp.source})|(${emailRegExp.source})`, 'gmi');

    return content
        .split(separator)
        .map((text) => {
            if (linkRegExp.test(text)) {
                return `<a href="${text}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
            if (phoneNumberRegExp.test(text)) {
                return `<a href="tel:${text}">${text}</a>`;
            }
            if (emailRegExp.test(text)) {
                return `<a href="mailto:${text}">${text}</a>`;
            }

            return text;
        })
        .join('');
}
