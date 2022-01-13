const sentryDsnKeys = ['source', 'protocol', 'user', 'pass', 'host', 'port', 'path'];
const sentryDsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w.-]+)(?::(\d+))?(\/.*)/;
export default function parseSentryDsn(dsn) {
    const dsnParts = sentryDsnPattern.exec(dsn) || [];
    const dsnInfo = {
        project: ''
    };
    let i = sentryDsnKeys.length;
    while (i--) {
        const prop = sentryDsnKeys[i];
        dsnInfo[prop] = dsnParts[i] || '';
    }
    dsnInfo.project = (dsnInfo.path && dsnInfo.path.split('/').pop()) || '';
    if (!dsnInfo.project) {
        throw new Error('Sentry DSN is invalid');
    }
    return dsnInfo;
}
//# sourceMappingURL=parse-sentry-dsn.js.map