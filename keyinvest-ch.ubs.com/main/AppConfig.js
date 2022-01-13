import { STATE_NAME_MAIN_REGISTER } from './constants';

export const AppConfigDev = {
  locale: 'de_CH',
  application: 'ch',
  environment: 'development',
  hostname: 'kelouragini.ch-backend.ubs-keyinvest.fra9.project2go.de',
  user: 'ubs-keyinvest',
  supportedLocales: ['de_CH'],
  numberSeparator: {
    decimalSeparator: '.',
    precision: 2,
    precisionMax: 6,
    thousandsSeparator: "'",
  },
  pageApiPath: '/api/v2/page-api',
  localesToUrl: {
    de_CH: 'http://de.local.com/',
    fr_CH: 'http://fe.local.com/',
    en_CH: 'http://en.local.com/',
  },
  disclaimer: {
    disclaimerAcceptanceRequired: true,
    'accept-url': '/disclaimer/disclaimer-page/accept',
    'cancel-url': 'https://www.ubs.com/global/en/investment-bank/keyinvest.html',
    countries: [
      {
        label: 'Australien',
        link: 'http://investments-au.ubs.com',
        selected: false,
      },
      {
        label: 'Schweiz',
        link: 'http://keyinvest-ch.ubs.com',
        selected: true,
      },
      {
        label: 'Deutschland',
        link: 'http://keyinvest-de.ubs.com',
        selected: false,
      },
      {
        label: 'Italien',
        link: 'http://keyinvest-it.ubs.com',
        selected: false,
      },
      {
        label: 'Südafrika',
        link: 'http://keyinvest-za.ubs.com',
        selected: false,
      },
      {
        label: 'Andere EWR Länder',
        link: 'http://keyinvest-eu.ubs.com',
        selected: false,
      },
      {
        label: 'Anderes Land',
        link: null,
        extraText: '>Danke für Ihr Interesse',
      },
    ],
    'disclaimer-page-rendered': {},
  },
  stateNameToUrl: {
    marketPage: '/market-overview',
    marketOverviewPage: '/market-overview',
    marketDiscountBarometerPage: '/market-overview/discount-barometer',
    marketDaxMembersPage: '/market-overview/dax-members',
    marketVolatilityMonitorPage: '/market-overview/volatility-monitor',
    serviceDocumentDownloadPage: '/service/order-detail',
    [STATE_NAME_MAIN_REGISTER]: 'main-register',
    knockoutMap: '/tool/knockout-map?sin=73',
  },
  searchAutoCompletePath: '/autocomplete.php',
  pushWebsocketEndpoints: [
    'wss://solvians-push3.ubs.com/websocket',
  ],
  pushHttpFallbackEndpoints: [
    'https://push2.ubs-keyinvest.production.solvians.com/pushserver',
  ],
  timeZone: 'Europe/Zurich',
  trackingSiteId: 150,
  navigation: {
    unlinked: [
      {
        stateName: 'cmsPage',
        url: '/disclaimer',
        pageTitle: 'Disclaimer',
      },
      {
        stateName: 'productDetailsPage',
        url: '/produkt/detail/:action/:identifierType/:identifierValue',
        pageTitle: 'productDetailsPage',
      },
      {
        stateName: 'trendRadarSignalDetailsPage',
        url: '/trendradar/signal/:signalIdentifier',
        pageTitle: 'trendRadarSignalDetailsPage',
      },
      {
        stateName: 'productListPage',
        url: '/produkt/list',
        pageTitle: 'productListPage',
      },
      {
        stateName: 'cmsPage',
        url: '/impressum',
        pageTitle: 'impressum',
      },
      {
        stateName: 'yieldMonitorPage',
        url: '/yield-monitor',
        pageTitle: 'YieldMonitorPage',
      },
    ],
    main: [
      {
        stateName: 'testPage',
        pageTitle: 'Test page',
        url: '/test',
        id: 99,
      },
      {
        stateName: 'marketPage',
        pageTitle: 'Markets',
        url: '/markets',
        id: 1,
        submenu: [
          {
            stateName: 'marketOverviewPage',
            pageTitle: 'Market Overview',
            url: '/market/index',
            id: 71,
          },
          {
            stateName: 'marketDiscountBarometerPage',
            pageTitle: 'FAQ',
            url: '/themen/faq',
            id: 72,
          },
          {
            stateName: 'cmsPage',
            pageTitle: 'Glossar',
            url: '/themen',
            id: 73,
          },
        ],
      },
      {
        stateName: 'cmsPage',
        pageTitle: 'Themen',
        url: '/themen',
        submenuActive: false,
        id: 3,
        submenu: [
          {
            stateName: 'cmsPage',
            pageTitle: 'Newsletter',
            url: '/themen',
            id: 31,
          },
          {
            stateName: 'cmsPage',
            pageTitle: 'FAQ',
            url: '/themen/faq',
            id: 32,
          },
          {
            stateName: 'cmsPage',
            pageTitle: 'Glossar',
            url: '/themen',
            id: 33,
          },
        ],
      },
      {
        stateName: 'cmsPage',
        pageTitle: 'Blog Newsletter',
        url: '/BlogNewsletter',
        id: 4,
      },
    ],
  },
};

export default function getAppConfig() {
  if (!window.AppConfig) {
    return AppConfigDev;
  }
  return window.AppConfig;
}
