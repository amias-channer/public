import axios from 'axios'
import { FormFlow, FormFileItem } from 'revolut-forms'

export const getServiceDeskForm = async (formId: string, formQueryString: string) => {
  const { data } = await axios.get<FormFlow>(`/forms/${formId}${formQueryString}`)
  return data
}

export const submitServiceDeskForm = async (form: FormFlow) => {
  const { data } = await axios.post<{ id: string }>(`/forms/${form.id}/submit`, form)
  return data
}

export const uploadServiceDeskFormFile = async (file: File, formId: string) => {
  const formData = new FormData()
  formData.append('body', file)
  const { data } = await axios.post<FormFileItem>(`/forms/${formId}/uploads`, formData)
  return data
}

export const fetchServiceDeskFormSubmissionAllowance = async (formId: string) => {
  const { data } = await axios.get<{ submitAllowed: boolean }>(`/forms/${formId}/submit`)
  return data.submitAllowed
}
