import { useCallback, useMemo, useState } from 'react'

export const useModal = () => {
  const [isOpen, setOpen] = useState(false)

  const showModal = useCallback(() => setOpen(true), [setOpen])
  const hideModal = useCallback(() => setOpen(false), [setOpen])

  const modalProps = useMemo(
    () => ({
      isOpen,
      /**
       * @deprecated Use "onExit" instead
       */
      onRequestClose: hideModal,
      onExit: hideModal,
    }),
    [isOpen, hideModal],
  )

  return [showModal, modalProps] as [VoidFunction, typeof modalProps]
}
