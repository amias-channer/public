export default function normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, '');
}
