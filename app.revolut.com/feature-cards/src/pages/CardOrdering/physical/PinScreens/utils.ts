export const isPinFilled = (value: string) => value.replace(/ /g, '').length === 4

// 1111, 3333, etc.
const pinHasSameNumbers = (digits: number[]) => {
  return digits.every((digit) => digit === digits[0])
}

// 1234, 5678, etc.
const pinHasSequentialNumbers = (digits: number[]) => {
  return digits.slice(1).every((digit, index) => digit - digits[index] === 1)
}

// 4321, 9876, etc.
const pinHasReversedSequentialNumbers = (digits: number[]) => {
  return digits
    .slice(0, digits.length - 1)
    .every((digit, index) => digit - digits[index + 1] === 1)
}

// logic was taken from https://bitbucket.org/revolut/revolut-android/src/60abb4bc67737dcf30274920457918585fc7a322/framework/core_utils/src/main/java/com/revolut/utils/utils/PinCodeChecker.kt#lines-9
export const isPinWeak = (value: string) => {
  const digits = value.split('').map((stringDigit) => parseInt(stringDigit))

  return (
    pinHasSameNumbers(digits) ||
    pinHasSequentialNumbers(digits) ||
    pinHasReversedSequentialNumbers(digits)
  )
}
