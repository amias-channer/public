export default function parseCompanyWebsiteUrl(companyProfileUrl: string): string | undefined {
    const urlRegex = /([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/;

    return urlRegex.exec(companyProfileUrl)?.splice(0, 1)[0];
}
