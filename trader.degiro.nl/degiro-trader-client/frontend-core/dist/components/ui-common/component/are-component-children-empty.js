function checkNonEmptyNode(node) {
    return Boolean(node);
}
export default function areComponentChildrenEmpty(children) {
    return children && Array.isArray(children) ? !children.some(checkNonEmptyNode) : !children;
}
//# sourceMappingURL=are-component-children-empty.js.map