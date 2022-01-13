import _ from "lodash"
import Web3 from "web3"
import { getIsTestnet } from "../store"
import chain from "./chain/chain"
import Web3EvmProvider from "./chain/providers/web3EvmProvider"

interface ContractConfig {
  ethereum: string
  rinkeby?: string
}

export const getContract = <T extends Web3.ContractInstance>(
  contractName: string,
): Web3.Contract<T> => {
  const abi = require(`../abi/${contractName}.json`)
  const provider = chain.providers.find(
    (provider): provider is Web3EvmProvider =>
      provider instanceof Web3EvmProvider,
  )
  if (!provider) {
    throw new Error("EVM provider not found.")
  }
  return provider.web3.eth.contract(abi)
}

export const getAddress = (
  contractConfig: ContractConfig,
): string | undefined => {
  return getIsTestnet() ? contractConfig.rinkeby : contractConfig.ethereum
}

export const ENJIN_MULTIVERSE_CONFIG: ContractConfig = {
  ethereum: "0x8562c38485B1E8cCd82E44F89823dA76C98eb0Ab",
}
export const SALE_CLOCK_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0x1f52b87c3503e537853e160adbf7e330ea0be7c4",
  rinkeby: "0x1f0356ce91f157c8537ae9320c592d1b07bcde48",
}
export const AXIE_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0xf4985070ce32b6b1994329df787d1acc9a2dd9e2",
}
export const TOKENS_OF_INFECTION_CONFIG: ContractConfig = {
  ethereum: "0x18f36d3222324ddac1efd0a524aabfb9d77d8041",
}
export const RARE_BITS_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0xb2c3531f77ee0a7ec7094a0bc87ef4a269e0bcfc",
}
export const RARE_BITS_AUCTION_V2_CONFIG: ContractConfig = {
  ethereum: "0xb8402001e82ae32b99cc77c23a44ead68cbdc8b1",
}
export const SALE_CLOCK_AUCTION_V2_CONFIG: ContractConfig = {
  ethereum: "0x23b45c658737b12f1748ce56e9b6784b5e9f3ff8",
  rinkeby: "0x07a8834c71d6bc60901cff3bc7870fef3027969c",
}
export const SALE_CLOCK_AUCTION_V3_CONFIG: ContractConfig = {
  ethereum: "0x78997e9e939daffe7eb9ed114fbf7128d0cfcd39",
  rinkeby: "0xed6cfc67429e8eb9b4562ea6d7d54ffcc4b726bd",
}
export const CRYPTOKITTIES_SALE_CLOCK_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0xb1690C08E213a35Ed9bAb7B318DE14420FB57d8C",
  rinkeby: "0x8a316edee51b65e1627c801dbc09aa413c8f97c2",
}
export const CRYPTOFIGHTERS_SALE_CLOCK_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0x7192bb75777dab47ef6fbf6f6c0e4bcbb2294f38",
}
export const ETHEREMON_TRADE_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0x4ba72f0f8dad13709ee28a992869e79d0fe47030",
}
export const DECENTRALAND_AUCTION_CONFIG: ContractConfig = {
  // Marketplace proxy address
  // See https://raw.githubusercontent.com/decentraland/contracts/gh-pages/addresses.json
  ethereum: "0x8e5660b4ab70168b5a6feea0e0315cb49c8cd539",
}
export const MAKERSPLACE_AUCTION_CONFIG: ContractConfig = {
  ethereum: "0x1f0678d1238921dc99309360668b16a17098aa2a",
  rinkeby: "0x03dfee5590f2ce8573162c7082de4f4a2e5dae29",
}
export const WARRIDERS_PRESALE_CONFIG: ContractConfig = {
  ethereum: "0xe272fddbd056240149c771f9fd917fa040dceb39",
  rinkeby: "0x5122fefd1fc4052437485a9159e7ba6aa9f544e0",
}
export const CHAINBREAKERS_PRESALE_CONFIG: ContractConfig = {
  ethereum: "0x0111ac7e9425c891f935c4ce54cf16db7c14b7db",
  rinkeby: "0xf313558d3d83e700182579bffcd1d330bb447413",
}
export const ENS_CONFIG: ContractConfig = {
  ethereum: "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
}
export const ENS_OLD_CONFIG: ContractConfig = {
  ethereum: "0x314159265dd8dbb310642f98f50c066173c1259b",
}
export const ENS_BASE_REGISTRAR_CONFIG: ContractConfig = {
  ethereum: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
}
export const ENS_OLD_BASE_REGISTRAR_CONFIG: ContractConfig = {
  ethereum: "0xfac7bea255a6990f749363002136af6556b31e04",
  rinkeby: "0x53ceb15b76023fbec5bb39450214926f6aa77d2e",
}
export const DCL_ENS_BASE_REGISTRAR_CONFIG: ContractConfig = {
  ethereum: "0x2a187453064356c898cae034eaed119e1663acb8",
}
export const OPENSEA_ENS_RESOLVER_CONFIG: ContractConfig = {
  ethereum: "0x9c4e9cce4780062942a7fe34fa2fa7316c872956",
  rinkeby: "0x74f20bd42d3198f5e5d4b5fd573df03361cfb6e8",
}
export const OPENSEA_COLLECTION_CONFIG: ContractConfig = {
  ethereum: "0x957ab98aa04ffc5c0cb1b61ce016cd954f2756f4",
  rinkeby: "0x750a1b8eaa90c36a5e8ec983ac88bad20b115a3a",
}
export const GODS_UNCHAINED_CARD_CONTRACT: ContractConfig = {
  ethereum: "0x0e3a2a1f2146d86a604adc220b4967a898d7fe07",
}
export const OLD_GODS_UNCHAINED_CARD_CONTRACT: ContractConfig = {
  ethereum: "0x629cdec6acc980ebeebea9e5003bcd44db9fc5ce",
}

/**
 * Check whether a contract is an OpenSea auction contract
 * @param address Address of auction contract
 */
export function isOpenSeaAuction(address: string) {
  return _(SALE_CLOCK_AUCTION_CONFIG)
    .values()
    .concat(_.values(SALE_CLOCK_AUCTION_V2_CONFIG))
    .concat(_.values(SALE_CLOCK_AUCTION_V3_CONFIG))
    .includes(address)
}

/**
 * Get the SaleClockAuction auction contract
 */
export function SaleClockAuction() {
  return getContract("SaleClockAuction")
}
/**
 * Get the SaleClockAuctionV2 auction contract
 */
export function SaleClockAuctionV2() {
  return getContract("NewSaleClockAuction")
}
/**
 * Get the ThirdPartySaleClockAuction auction contract
 */
export function ThirdPartySaleClockAuction() {
  return getContract("ThirdPartySaleClockAuction")
}
/**
 * Get the ERC721 auction contract
 */
export function ERC721() {
  return getContract("ERC721")
}
/**
 * Get the ERC721v3 auction contract
 */
export function ERC721v3() {
  return getContract("ERC721v3")
}
/**
 * Get the Enjin ERC-1155 auction contract
 */
export function Enjin1155() {
  return getContract("Enjin1155")
}
/**
 * Get the EtheremonTrade auction contract
 */
export function EtheremonTrade() {
  return getContract("EtheremonTrade")
}
/**
 * Get the MakersplaceAuction auction contract
 */
export function MakersplaceAuction() {
  return getContract("MakersPlace")
}
/**
 * Get the Decentraland auction contract
 */
export function DecentralandAuctionContract() {
  return getContract("DecentralandMarketplace")
}
/**
 * Get the OpenSea Collection contract
 */
export function OpenSeaCollection() {
  return getContract("OpenSeaCollection")
}
/**
 * Get the OpenSea Asset contract
 */
export function OpenSeaAsset() {
  return getContract("OpenSeaAsset")
}
/**
 * Get the ENS contract
 */
export function ENS() {
  return getContract("ENS")
}
/**
 * Get OpenSea's ENS resolver contract
 */
export function OpenSeaENSResolver() {
  return getContract("OpenSeaENSResolver")
}
