import normalizeUserName from './normalize-username';

export default function matchUserNames(username1: string | undefined, username2: string | undefined): boolean {
    return normalizeUserName(username1) === normalizeUserName(username2);
}
