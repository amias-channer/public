import { checkIfRetailApp } from '../helpers/retail'
// Bot agent messages should be ignored as bots are not used for the business app.
export const BOT_NAMES_TO_IGNORE = checkIfRetailApp()
  ? []
  : ['Rita Bot', 'PotatoOS 9000']
export const BOT_IDS_TO_IGNORE = checkIfRetailApp()
  ? []
  : [
      '20ab2b05-4c74-4328-9a0e-c208323d2b03',
      '73a73c1e-f45f-4cd3-b192-7abad67c84f5',
    ]
