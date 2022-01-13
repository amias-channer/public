export enum RedirectReasons {
    SESSION_EXPIRED = 'session_expired',
    USER_ACTIVATED = 'user_activated',
    US_PERSON = 'us_person'
}

export interface AppParams {
    reason?: RedirectReasons;
    [key: string]: any;
}
