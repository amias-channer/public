import jwtDecode, { JwtPayload } from "jwt-decode"
import moment from "moment"
import * as yup from "yup"
import { JWTPayload } from "./types"

const jwtSchema = yup.object().shape({
  exp: yup.number().required().positive(),
  origIat: yup.number().required().positive(),
  username: yup.string().required(),
  user_id: yup.string().required(),
  address: yup.string().required(),
  chain: yup.string().required(),
})

export const decodeJwtToken = (token: string): JWTPayload => {
  return jwtDecode<JWTPayload>(token)
}

export const matchesJwtSchema = (payload: JwtPayload) => {
  return jwtSchema.isValidSync(payload)
}

export const isJwtExpired = (payload: JWTPayload) => {
  const exp = moment.unix(payload.exp).subtract(1, "hour")
  return moment().isAfter(exp)
}
