export var UserAccountTypes;
(function (UserAccountTypes) {
    UserAccountTypes["ACTIVE"] = "ACTIVE";
    UserAccountTypes["BASIC"] = "BASIC";
    UserAccountTypes["TRADER"] = "TRADER";
})(UserAccountTypes || (UserAccountTypes = {}));
export var UserAccountUpgradeStatuses;
(function (UserAccountUpgradeStatuses) {
    // all the prerequisites have been met and the account has been upgraded
    UserAccountUpgradeStatuses["ACCOUNT_UPGRADED"] = "ACCOUNT_UPGRADED";
    // need to sign agreements manually by downloading the PDF (i18n key upgradeAccount.agreement.manual.signature.link)
    UserAccountUpgradeStatuses["AGREEMENTS_MANUAL_SIGNATURE_NEEDED"] = "AGREEMENTS_MANUAL_SIGNATURE_NEEDED";
    // need to sign agreements by completing the PRIVATE_UPGRADE_AGREEMENTS task
    UserAccountUpgradeStatuses["AGREEMENTS_TASK_NEEDED"] = "AGREEMENTS_TASK_NEEDED";
    // some tests need to be taken, cannot sign agreements yet
    UserAccountUpgradeStatuses["TESTS_NEEDED"] = "TESTS_NEEDED";
})(UserAccountUpgradeStatuses || (UserAccountUpgradeStatuses = {}));
export var UserContractTypes;
(function (UserContractTypes) {
    UserContractTypes["AM"] = "AM";
    UserContractTypes["CORPORATE"] = "CORPORATE";
    UserContractTypes["JOINT"] = "JOINT";
    UserContractTypes["MINOR"] = "MINOR";
    UserContractTypes["PRIVATE"] = "PRIVATE";
    UserContractTypes["TRIPARTITE"] = "TRIPARTITE";
})(UserContractTypes || (UserContractTypes = {}));
export var PrimaryBankAccountChangeRequestResults;
(function (PrimaryBankAccountChangeRequestResults) {
    PrimaryBankAccountChangeRequestResults["EMAIL_CONFIRMATION_SENT"] = "EMAIL_CONFIRMATION_SENT";
    PrimaryBankAccountChangeRequestResults["PHONE_CONFIRMATION_NEEDED"] = "PHONE_CONFIRMATION_NEEDED";
})(PrimaryBankAccountChangeRequestResults || (PrimaryBankAccountChangeRequestResults = {}));
//# sourceMappingURL=user.js.map