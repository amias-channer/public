const spacesPattern: RegExp = /\s/g;

export default function normalizeIban(iban: string): string {
    return (iban || '').replace(spacesPattern, '').toUpperCase();
}
