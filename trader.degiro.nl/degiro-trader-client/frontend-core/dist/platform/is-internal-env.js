export var InternalEnvironments;
(function (InternalEnvironments) {
    InternalEnvironments["INTERNAL_PROD"] = "internal_prop";
    InternalEnvironments["INTERNAL_TEST"] = "internal_test";
    InternalEnvironments["INTERNAL_WEEKLY"] = "internal_weekly";
})(InternalEnvironments || (InternalEnvironments = {}));
export default function isInternalEnv(env) {
    const { host } = location;
    const isLocalMachine = host.startsWith('192.168') || host.startsWith('localhost') || host.startsWith('127.0.0.1');
    // we assume that it's a devserver running
    if (isLocalMachine) {
        return true;
    }
    if (env === InternalEnvironments.INTERNAL_TEST) {
        return host === 'test-webtrader.internal.degiro.eu';
    }
    if (env === InternalEnvironments.INTERNAL_WEEKLY) {
        return host === 'test-weekly-webtrader.internal.degiro.eu';
    }
    if (env === InternalEnvironments.INTERNAL_PROD) {
        return host === 'internal.degiro.eu';
    }
    // check for all internal environments
    return host.includes('internal.degiro.eu');
}
//# sourceMappingURL=is-internal-env.js.map