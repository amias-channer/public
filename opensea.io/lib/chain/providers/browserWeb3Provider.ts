import Web3 from "web3"
import { WALLET_NAME } from "../../../constants"
import Web3EvmProvider from "./web3EvmProvider"

interface Web3Window {
  ethereum?: Web3.Provider
  web3?: Web3
}

export default class BrowserWeb3Provider extends Web3EvmProvider {
  web3: Web3

  constructor() {
    super()
    const w = window as Web3Window
    const ethereum = w.ethereum
    if (ethereum) {
      this.web3 = new Web3(ethereum)
      return
    }
    const web3 = w.web3
    if (web3) {
      this.web3 = new Web3(web3.currentProvider)
      return
    }
    throw new Error("Could not find web3")
  }

  getName() {
    const web3Provider = this.getWeb3Provider() as {
      isDapper?: boolean
      isMetaMask?: boolean
      isTrust?: boolean
    }
    if (web3Provider.isDapper) {
      return WALLET_NAME.Dapper
    }
    if (web3Provider.isMetaMask) {
      return WALLET_NAME.MetaMask
    }
    if (web3Provider.isTrust) {
      return WALLET_NAME.Trust
    }
    return WALLET_NAME.Native
  }
}
