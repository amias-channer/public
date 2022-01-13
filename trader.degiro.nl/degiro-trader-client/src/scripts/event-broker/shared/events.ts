export function isNamespaceEvent(event: string): boolean {
    return parseNamespaceEvent(event).namespace !== undefined;
}

export function parseNamespaceEvent(event: string): {namespace: string | undefined; eventName: string} {
    const parts: string[] = event.split(':');

    if (parts.length === 1) {
        return {
            namespace: undefined,
            eventName: parts[0]
        };
    }

    return {
        namespace: parts[0],
        eventName: parts[1]
    };
}
