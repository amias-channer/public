import getDictionary from '../dictionary/get-dictionary';
function sortRegions({ id: firstId }, { id: secondId }) {
    return firstId - secondId;
}
export default function getDictionaryRegions(config) {
    return getDictionary(config).then((dictionary) => {
        return dictionary.regions.slice(0).sort(sortRegions);
    });
}
//# sourceMappingURL=get-dictionary-regions.js.map