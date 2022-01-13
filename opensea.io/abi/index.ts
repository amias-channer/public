import type { AnnotatedFunctionABI } from "wyvern-schemas/dist/types"
export const CanonicalWETH = require("./CanonicalWETH.json")
export const ERC20 = require("./ERC20.json")
export const WyvernExchange = require("./WyvernExchange.json")

export const method = (abi: AnnotatedFunctionABI[], name: string) => {
  return abi.filter(x => x.type === "function" && x.name === name)[0]
}

export const event = (abi: AnnotatedFunctionABI[], name: string) => {
  return abi.filter(x => x.type === "event" && x.name === name)[0]
}
