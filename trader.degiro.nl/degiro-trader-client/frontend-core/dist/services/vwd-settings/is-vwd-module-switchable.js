const unavailableModules = [
    22,
    23 // Nasdaq OMX Nordic Derivatives, Custody Client (see WF-1416)
];
export default function isVwdModuleSwitchable(client, module) {
    return module.switchable && !(client.isCustodyClient && unavailableModules.includes(module.id));
}
//# sourceMappingURL=is-vwd-module-switchable.js.map