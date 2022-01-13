import { FormSchemeComponent } from './types'

export const filterFormSchema = (
  formSchema: Array<FormSchemeComponent | undefined>,
): FormSchemeComponent[] =>
  formSchema.filter((value) => Boolean(value)) as FormSchemeComponent[]
