const WEB_APP_PROD_HOSTS = [
  'beta.app.revolut.com',
  'app.revolut.com',
  'business.revolut.com',
]
const WEB_APP_DEV_HOSTS = ['app.revolut.codes', 'business.revolut.codes']
const WEB_APP_LOC_HOSTS = ['localhost']
const WEB_APP_HOSTS = [...WEB_APP_PROD_HOSTS, ...WEB_APP_DEV_HOSTS]

const FEATURE_BRANCH = [/^\S+.app.revolut.codes/, /^\S+.business.revolut.codes/]

export const isRetailCodesApp = () =>
  [WEB_APP_DEV_HOSTS[0], FEATURE_BRANCH[0]].includes(window.location.hostname)

export const checkIfRetailApp = () =>
  WEB_APP_HOSTS.includes(window.location.hostname)

export const checkIfRetailAppTest = () =>
  WEB_APP_DEV_HOSTS.includes(window.location.hostname)

export const checkIfRetailAppProd = () =>
  WEB_APP_PROD_HOSTS.includes(window.location.hostname)

export const checkIfLocalHost = () =>
  WEB_APP_LOC_HOSTS.includes(window.location.hostname)

export const checkIfFeatureBranch = () =>
  FEATURE_BRANCH.some((regex) => regex.test(window.location.hostname))
