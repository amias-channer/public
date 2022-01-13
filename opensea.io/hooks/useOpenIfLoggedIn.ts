import useAppContext from "./useAppContext"

const useOpenIfLoggedIn = () => {
  const { wallet, login } = useAppContext()
  const viewer = wallet.getActiveAccountKey()

  const handleOpen = (open: () => unknown) => async () => {
    if (!viewer) {
      await login()
    }
    open()
  }
  return handleOpen
}

export default useOpenIfLoggedIn
