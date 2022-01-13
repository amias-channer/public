// tslint:disable
/**
 * Revolut API
 * OpenAPI spec for Revolut API
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * 
 * @export
 * @enum {string}
 */
export enum CardStateReason {
    SuspiciousCardTransaction = 'SUSPICIOUS_CARD_TRANSACTION',
    DeclinedByFraudDetectorTransaction = 'DECLINED_BY_FRAUD_DETECTOR_TRANSACTION',
    Compromised = 'COMPROMISED',
    Undelivered = 'UNDELIVERED',
    Expired = 'EXPIRED',
    ChangedByUser = 'CHANGED_BY_USER',
    PreOrderCancelled = 'PRE_ORDER_CANCELLED',
    FoundOnDarknet = 'FOUND_ON_DARKNET'
}



