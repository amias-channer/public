import BigNumber from "bignumber.js"
import { AnyAction } from "redux"
import * as ActionTypes from "../actions"
import { bn } from "../lib/helpers/numberUtils"
import { map } from "../lib/helpers/object"
import { User, buildUser } from "./users"

export enum AccountConfig {
  AffiliateAccepted = "affiliate",
  PartnerAccepted = "affiliate_partner",
  Verified = "verified",
  AffiliateRequested = "affiliate_requested",
  Moderator = "moderator",
}

export enum BadgeType {
  VerifiedBadge = "verified_badge",
  ModeratorBadge = "moderator_badge",
}

export interface Account {
  id?: number
  address?: string
  label?: string
  proxy?: string
  image?: string
  config?: AccountConfig
  badgeType?: BadgeType
  discordID?: string
  etherBalance?: BigNumber
  tokenBalance?: BigNumber
  user?: User
  deployedAddress?: string
  isCurrent?: boolean
  currencies?: { [tokenContractAddress: string]: Currency }
}

export interface Currency {
  // TODO (joshuawu): Use this type to replace the current Token
  token: {
    symbol: string
    address: string
    imageUrl: string | null
    name: string
    decimals: number
    ethPrice: BigNumber
    usdPrice: BigNumber | null
  }
  balance: BigNumber
  commitment: BigNumber
}

const initialState: Account = {}

const AccountsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ActionTypes.RESET_ACCOUNT:
      return initialState

    case ActionTypes.RECEIVE_ACCOUNT:
      return {
        ...state,
        ...buildAccount(action.data),

        // TODO (joshuawu): remove
        isCurrent: action.data.isCurrent,
        proxy: action.data.proxy,
      }

    case ActionTypes.RECEIVE_ETHER_BALANCE:
      return {
        ...state,
        etherBalance: action.etherBalance,
      }

    case ActionTypes.RECEIVE_TOKEN_BALANCE:
      return {
        ...state,
        tokenBalance: action.tokenBalance,
      }

    case ActionTypes.DEPLOYED_NEW_CONTRACT:
      return {
        ...state,
        deployedAddress: action.address,
      }

    case ActionTypes.DEPLOYED_NEW_CONTRACT_RESET:
      return {
        ...state,
        deployedAddress: null,
      }

    default:
      return state
  }
}

/**
 * Create an Account from API data
 * @param accountData data from API
 */
export function buildAccount(accountData: any): Account {
  const account: Account = {
    id: accountData["id"],
    address: accountData["address"],
    label: accountData["address"],
    image: accountData["profile_img_url"],
    config: accountData["config"],
    discordID: accountData["discord_id"],
    badgeType: buildBadgeType(accountData),
    currencies:
      accountData["currencies"] && buildCurrencies(accountData["currencies"]),
  }
  const userData = accountData["user"]
  if (userData && typeof userData == "object") {
    account["user"] = buildUser(userData)
    account["label"] = account.user.publicUsername || account.label
  }
  return account
}

const buildCurrencies = (
  data: any,
): { [tokenContractAddress: string]: Currency } =>
  map(data, (currenciesData: any) => {
    const tokenContractData = currenciesData["token_contract"]
    // TODO (joshuawu): Merge this with the Token reducer
    const token = {
      symbol: tokenContractData["symbol"],
      address: tokenContractData["address"],
      imageUrl: tokenContractData["image_url"],
      name: tokenContractData["name"],
      decimals: tokenContractData["decimals"],
      ethPrice:
        tokenContractData["eth_price"] &&
        new BigNumber(tokenContractData["eth_price"]),
      usdPrice:
        tokenContractData["usd_price"] &&
        new BigNumber(tokenContractData["usd_price"]),
    }
    return {
      token,
      balance: bn(currenciesData["balance"], token.decimals),
      commitment: bn(currenciesData["commitment"], token.decimals),
    }
  })

const buildBadgeType = (data: any): BadgeType | undefined => {
  const accountConfig = data["config"]
  const showBlueCheckmark =
    accountConfig && [AccountConfig.Verified].includes(accountConfig)
  const showGreenCheckmark =
    accountConfig &&
    [AccountConfig.Moderator].includes(accountConfig) &&
    !!data["discord_id"]
  const badgeType = showGreenCheckmark
    ? BadgeType.ModeratorBadge
    : showBlueCheckmark
    ? BadgeType.VerifiedBadge
    : undefined
  return badgeType
}

export default AccountsReducer
