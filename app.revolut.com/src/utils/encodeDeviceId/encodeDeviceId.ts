import { getRandomValues } from './getRandomValues'
import { stringToBytes } from './stringToBytes'
import { applyValuesToBuffer } from './applyValuesToBuffer'
import { applyXorToBuffer } from './applyXorToBuffer'
import { int32ToBytes, int64ToBytes } from './intToBytes'
import { stringToBase64 } from './stringToBase64'
import { parseUuid } from './parseUuid'

const ENCODED_SIZE_IN_BYTES_WITHOUT_VENDOR_ID = 64
const VENDOR_ID_BYTES_ALIGNMENT = 4

const generateSalt8 = (length: number) => getRandomValues(new Int8Array(length))

const generateInt32 = () => getRandomValues(new Int32Array(1))[0]

/**
 * https://revolut.atlassian.net/wiki/spaces/BD/pages/1321207903/Device+ID+specifications
 */
export const encodeDeviceId = ({
  deviceIdVersion,
  deviceId,
  vendorId,
  encodeBase64 = true,
}: {
  deviceIdVersion: number
  deviceId: string
  vendorId?: string
  encodeBase64?: boolean
}) => {
  const randomKey = generateInt32()
  const version = BigInt(deviceIdVersion * randomKey)

  const vendorIdSize = vendorId
    ? stringToBytes(vendorId).length + VENDOR_ID_BYTES_ALIGNMENT
    : 0

  const saltedDeviceId = applyValuesToBuffer(
    new Int8Array(32),
    generateSalt8(8),
    parseUuid(deviceId),
    generateSalt8(8),
  )
  const saltedDeviceIdWithXor = applyXorToBuffer(saltedDeviceId, int32ToBytes(randomKey))

  const result = applyValuesToBuffer(
    new Int8Array(ENCODED_SIZE_IN_BYTES_WITHOUT_VENDOR_ID + vendorIdSize),
    int64ToBytes(version),
    generateSalt8(4),
    int32ToBytes(randomKey),
    generateSalt8(4),
    saltedDeviceIdWithXor,
    generateSalt8(12),
    ...(vendorId ? [generateSalt8(4), stringToBytes(vendorId)] : []),
  )

  return encodeBase64 ? stringToBase64(result) : result
}
