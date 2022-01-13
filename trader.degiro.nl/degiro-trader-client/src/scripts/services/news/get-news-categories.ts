import {NewsCategory, NewsCategoryIds} from '../../models/news';

// TODO: move to BE
export default function getNewsCategories(): NewsCategory[] {
    return [
        {
            id: NewsCategoryIds.ALL,
            label: 'All',
            subCategories: [
                {
                    id: NewsCategoryIds.ALL,
                    label: 'All'
                }
            ]
        },
        {
            id: NewsCategoryIds.ON_FOCUS,
            label: 'On Focus',
            subCategories: [
                {
                    id: 'FrontPage',
                    label: 'Headlines'
                },
                {
                    id: 'BreakingViews',
                    label: 'Breaking Views'
                },
                {
                    id: 'WorldNews',
                    label: 'World News'
                }
            ]
        },
        {
            id: NewsCategoryIds.COMPANIES,
            label: 'Companies',
            subCategories: [
                {
                    id: 'AsianCompanies',
                    label: 'Asian Companies'
                },
                {
                    id: 'EuropeanCompanies',
                    label: 'European Companies'
                },
                {
                    id: 'USCompanies',
                    label: 'U.S. Companies'
                }
            ]
        },
        {
            id: NewsCategoryIds.NATIONAL_AND_REGIONAL,
            label: 'National & Regional',
            subCategories: [
                {
                    id: 'UnitedStates',
                    label: 'United States'
                },
                {
                    id: 'SouthAndSoutheastAsiaAusNZ',
                    label: 'South and Southeast Asia, Aus/NZ'
                },
                {
                    id: 'GreaterChinaJapanAndTheKoreas',
                    label: 'Greater China, Japan & the Koreas'
                },
                {
                    id: 'EuropeUKAndRussia',
                    label: 'Europe, UK & Russia'
                },
                {
                    id: 'Canada',
                    label: 'Canada'
                },
                {
                    id: 'LatinAmerica',
                    label: 'Latin America'
                },
                {
                    id: 'MiddleEastAndAfrica',
                    label: 'Middle East & Africa'
                },
                {
                    id: 'France',
                    label: "L’essentiel de l'actualité"
                },
                {
                    id: 'Deutschland',
                    label: 'Deutschland'
                },
                {
                    id: 'Brazil',
                    label: 'Brasil'
                }
            ]
        },
        {
            id: NewsCategoryIds.BANKING_AND_FINANCE,
            label: 'Banking & Finance',
            subCategories: [
                {
                    id: 'CentralBanksAndGlobalEconomy',
                    label: 'Central Banks & Global Economy'
                },
                {
                    id: 'FinancialServices',
                    label: 'Financial Services'
                },
                {
                    id: 'InvestmentBanking',
                    label: 'Investment Banking'
                },
                {
                    id: 'SustainableFinance',
                    label: 'Sustainable Finance'
                }
            ]
        },
        {
            id: NewsCategoryIds.MARKETS,
            label: 'Markets',
            subCategories: [
                {
                    id: 'EmergingMarkets',
                    label: 'Emerging Markets'
                },
                {
                    id: 'FixedIncome',
                    label: 'Fixed Income'
                },
                {
                    id: 'GlobalMarkets',
                    label: 'Global Markets'
                },
                {
                    id: 'ForeignExchange',
                    label: 'Foreign Exchange'
                }
            ]
        },
        {
            id: NewsCategoryIds.INDUSTRIES,
            label: 'Industries',
            subCategories: [
                {
                    id: 'TechnologyMediaAndTelecoms',
                    label: 'Technology, Media & Telecoms'
                },
                {
                    id: 'IndustrialsAndTransport',
                    label: 'Industrials & Transport'
                },
                {
                    id: 'HealthcareAndPharma',
                    label: 'Healthcare & Pharma'
                },
                {
                    id: 'ConsumerAndRetail',
                    label: 'Consumer & Retail '
                },
                {
                    id: 'BasicMaterials',
                    label: 'Basic Materials'
                },
                {
                    id: 'Sport',
                    label: 'Sport'
                },
                {
                    id: 'LifestyleAndEntertainment',
                    label: 'Lifestyle & Entertainment'
                }
            ]
        }
    ];
}
