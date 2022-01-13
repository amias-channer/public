export enum IexStatuses {
    CANCEL = 'cancel',
    EXPIRED = 'expired',
    FAILURE = 'failure',
    SUCCESS = 'success'
}

export enum IexActions {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe'
}

export interface IexConnectParams {
    iexId: string;
    iexAction: IexActions;
    iexTimestamp: number;
    iexCode: string;
}

export interface IexReturnUrlParams {
    iexTimestamp: number;
    iexCode: string;
}

export interface IexReturnUrlGenerationParams {
    iexId: string;
    iexAction: IexActions;
    iexStatus: IexStatuses;
}

export interface IexParams extends IexConnectParams {
    iexReturnUrl: string;
}
