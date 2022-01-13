import getDictionary from '../../dictionary/get-dictionary';
export default async function getOptionAggregateTypes(config) {
    const { optionAggregateTypes } = await getDictionary(config);
    // TODO: Support aggregate type `strike`
    return optionAggregateTypes.filter((type) => {
        const { id } = type;
        return id !== 'derivativeExchange' && id !== 'strike';
    });
}
//# sourceMappingURL=get-option-aggregate-types.js.map