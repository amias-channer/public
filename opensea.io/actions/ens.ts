import Web3 from "web3"
import {
  ENS_CONFIG,
  OPENSEA_ENS_RESOLVER_CONFIG,
  ENS,
  OpenSeaENSResolver,
  getAddress,
} from "../lib/contracts"
import { promisify1, promisify2, promisify3 } from "../lib/helpers/promise"
import Transport from "../lib/transport"
import { confirmTransaction, getGasPrice } from "../lib/wyvern"
import { Account } from "../reducers/accounts"
import { buildAsset, Asset } from "../reducers/assets"

// We don't need to know the name of this node to know the namehash,
// as long as we know the token ID. So here's a modified namehash
// algorithm that takes advantage of that.
const getNamehash = (tokenId: string) => {
  const web3 = new Web3()
  const nil = "0x" + Array(32).fill("00").join("")
  const subnamehash = web3.sha3(nil + web3.sha3("eth").substring(2), {
    encoding: "hex",
  })
  return web3.sha3(subnamehash + web3.toHex(tokenId).substring(2), {
    encoding: "hex",
  })
}

const EnsActions = {
  async getAsset(name: string): Promise<Asset> {
    const {
      data: { asset: assetData },
    } = await Transport.fetch(`/misc/ens_asset/${name}/`)
    return buildAsset(assetData)
  },

  async isResolverSet({ tokenId }: Asset): Promise<boolean> {
    const contractAddress = getAddress(ENS_CONFIG)
    if (!tokenId || !contractAddress) {
      return false
    }
    const contract = await ENS().at(contractAddress)
    const resolverAddress = await promisify1<string, string>(contract.resolver)(
      getNamehash(tokenId),
    )
    return resolverAddress === getAddress(OPENSEA_ENS_RESOLVER_CONFIG)
  },

  async setResolver(
    { address }: Account,
    { tokenId }: Asset,
    onPrompt?: () => any,
  ): Promise<void> {
    const ensContractAddress = getAddress(ENS_CONFIG)
    const resolverContractAddress = getAddress(OPENSEA_ENS_RESOLVER_CONFIG)
    if (
      !address ||
      !tokenId ||
      !ensContractAddress ||
      !resolverContractAddress
    ) {
      return
    }
    const ensContract = await ENS().at(ensContractAddress)
    const resolverContract = await OpenSeaENSResolver().at(
      resolverContractAddress,
    )
    const gasPrice = await getGasPrice()
    const txOptions = {
      from: address,
      gasPrice,
    }
    const txs = await Promise.all([
      promisify3<string, string, Web3.TxData, string>(ensContract.setResolver)(
        getNamehash(tokenId),
        resolverContractAddress,
        txOptions,
      ),
      promisify2<string, Web3.TxData, string>(resolverContract.addTokenId)(
        tokenId,
        txOptions,
      ),
    ])
    if (onPrompt) {
      onPrompt()
    }
    const receipts = await Promise.all(txs.map(confirmTransaction))
    if (!receipts.every(x => x)) {
      throw new Error("An error occurred while setting the resolver.")
    }
  },
}
export default EnsActions
