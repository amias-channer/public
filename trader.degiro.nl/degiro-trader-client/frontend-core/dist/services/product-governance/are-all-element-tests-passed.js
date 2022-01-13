import { ProductGovernanceTestStatuses } from '../../models/product-governance';
export default function areAllElementTestsPassed(element) {
    return [element.mainTestInfo, element.partnerTestInfo].every((testInfo) => {
        return !testInfo || testInfo.status === ProductGovernanceTestStatuses.PASSED;
    });
}
//# sourceMappingURL=are-all-element-tests-passed.js.map