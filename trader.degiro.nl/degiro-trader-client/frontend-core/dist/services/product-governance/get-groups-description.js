import localize from '../../services/i18n/localize';
export default function getGroupsDescription(i18n, groups) {
    return groups
        .reduce((titles, group) => {
        titles.push(localize(i18n, `trader.productGovernance.groups.${group.type}.title`));
        return titles;
    }, [])
        .join(', ');
}
//# sourceMappingURL=get-groups-description.js.map