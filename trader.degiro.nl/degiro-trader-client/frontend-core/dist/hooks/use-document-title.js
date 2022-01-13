import { useEffect, useRef } from 'react';
/**
 * @warning Use carefully! There might be a bug with this component. Please read the description.
 * @description IMPORTANT! Use carefully! You might catch bugs with this component! :
 * Let assume that you have such component tree structure
 *                       +--------------------+
 *                       | title: Root title  |
 *                       +---------+----------+
 *                                 |
 *                           +-----+-------+
 *                           |             |
 *        +------------------v--+       +--v------------------+
 *        | title: {A1} title   |       | title: {B1} title   |
 *        +------------------+--+       +---------------------+
 *                           |
 *           +---------------v---+
 *           | title: {A2} title |
 *           +-------------------+
 *
 *  1.Conflict situation. What title should be displayed?
 *  2.Let assume that we resolve this conflict and chose to render {A2} title"
 *  3.If you try to set {B1} component title (asynchronous) you will get
 *    Error:
 *        Expect: Document.title = {A2} title
 *        Actual: Document.title = {B1} title
 *
 *  Also there are few corner cases with add/remove/update nodes (Components) in the tree view.
 *
 *  For now we do not provide any conflict resolving algorithm.
 *  That is why you should care about all corner cases by yourself.
 * @param {string} title
 * @returns {void}
 */
export default function useDocumentTitle(title) {
    const defaultTitle = useRef(document.title);
    useEffect(() => {
        document.title = title;
        return () => {
            document.title = defaultTitle.current;
        };
    }, [title]);
}
//# sourceMappingURL=use-document-title.js.map