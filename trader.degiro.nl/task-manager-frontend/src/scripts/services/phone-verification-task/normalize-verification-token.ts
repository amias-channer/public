export default function normalizeVerificationToken(token: string): string {
    return token.replace(/\s+/g, '');
}
