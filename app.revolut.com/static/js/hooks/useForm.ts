import { useContext } from 'react'

import { FormsContext } from 'components/Forms/FormsContext'

export const useForm = () => {
  const { openForm } = useContext(FormsContext)
  return {
    openForm,
  }
}
