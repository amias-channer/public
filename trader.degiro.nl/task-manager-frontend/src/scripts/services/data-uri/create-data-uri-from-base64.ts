type MimeType = 'image/jpg';

export default function createDataUriFromBase64(base64: string, mimeType: MimeType): string {
    return `data:${mimeType};base64,${base64}`;
}
