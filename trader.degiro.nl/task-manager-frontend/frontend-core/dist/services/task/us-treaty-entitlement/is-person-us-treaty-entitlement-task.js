/**
 * @todo PRIVATE_US_TREATY_ENTITLEMENT is deprecated, remove it after BE
 * @param {Task} task
 * @returns {boolean}
 */
export default function isPersonUsTreatyEntitlementTask({ taskType }) {
    return taskType === 'PERSON_US_TREATY_ENTITLEMENT' || taskType === 'PRIVATE_US_TREATY_ENTITLEMENT';
}
//# sourceMappingURL=is-person-us-treaty-entitlement-task.js.map