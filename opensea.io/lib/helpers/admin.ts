import API from "../api"
import { pkFromRelayId } from "../graphql/graphql"

type AdminModel = "asset" | "collection" | "account" | "assetbundle"

export const getAdminChangeUrl = ({
  relayId,
  model,
}: {
  relayId: string
  model: AdminModel
}) => {
  return `${API.getUrl()}/admin/api/${model}/${pkFromRelayId(relayId)}/change/`
}

export const getAssetChangeAdminUrl = (relayId: string) => {
  return getAdminChangeUrl({ relayId, model: "asset" })
}

export const getCollectionChangeAdminUrl = (relayId: string) => {
  return getAdminChangeUrl({ relayId, model: "collection" })
}

export const getAccountChangeAdminUrl = (relayId: string) => {
  return getAdminChangeUrl({ relayId, model: "account" })
}

export const getBundleChangeAdminUrl = (relayId: string) => {
  return getAdminChangeUrl({ relayId, model: "assetbundle" })
}
