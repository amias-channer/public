import assign from 'lodash/assign'
import { useRef } from 'react'

const useFormikInstance = <T extends {}>(value: T): T => {
  const ref = useRef<T>()

  if (!ref.current) {
    ref.current = value
  } else {
    assign(ref.current, value)
  }

  return ref.current as T
}

export default useFormikInstance
