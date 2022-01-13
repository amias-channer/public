// this list should be always aligned with all possible values for `User.culture`
const timezonesPerCountry = {
    AT: 'Europe/Vienna',
    PT: 'Europe/Lisbon',
    GR: 'Europe/Athens',
    GB: 'Europe/London',
    FI: 'Europe/Helsinki',
    IE: 'Europe/Dublin',
    FR: 'Europe/Paris',
    DE: 'Europe/Berlin',
    NL: 'Europe/Amsterdam',
    BE: 'Europe/Brussels',
    CZ: 'Europe/Prague',
    PL: 'Europe/Warsaw',
    ES: 'Europe/Madrid',
    HU: 'Europe/Budapest',
    IT: 'Europe/Rome',
    DK: 'Europe/Copenhagen',
    SE: 'Europe/Stockholm',
    NO: 'Europe/Oslo',
    CH: 'Europe/Zurich'
};
export default function getCountryTimezone(countryCode) {
    return timezonesPerCountry[countryCode] || timezonesPerCountry.NL;
}
//# sourceMappingURL=get-country-timezone.js.map