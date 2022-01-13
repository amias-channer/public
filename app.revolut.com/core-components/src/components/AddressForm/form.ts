import { isCountryWithoutRegion } from '@revolut/rwa-core-utils'

import {
  AddressSearchField,
  FormInputSelect,
  FormTextInput,
  PostCodeSearchField,
} from '../FormFields'
import { FormSchemaConditions, FormSchemaField } from './types'

export const createFormSchema = ({
  countryCode,
  isPostCodeSupported,
  isPostCodeLookupSupported,
  isAddressSearchSupported,
  addressFieldsActive,
  isSearchSupported,
}: FormSchemaConditions): FormSchemaField[] => [
  {
    name: 'country',
    Component: FormInputSelect,
    isRendered: true,
  },
  {
    name: 'postCodeSearch',
    Component: PostCodeSearchField,
    isRendered: isPostCodeLookupSupported,
  },
  {
    name: 'addressSearch',
    Component: AddressSearchField,
    isRendered: isAddressSearchSupported,
  },
  {
    name: 'addressLine1',
    Component: FormTextInput,
    isRendered: !isSearchSupported || addressFieldsActive,
  },
  {
    name: 'addressLine2',
    Component: FormTextInput,
    isRendered: !isSearchSupported || addressFieldsActive,
  },
  {
    name: 'postCode',
    Component: FormTextInput,
    isRendered:
      (!isSearchSupported || (!isPostCodeLookupSupported && addressFieldsActive)) &&
      isPostCodeSupported,
  },
  {
    name: 'city',
    Component: FormTextInput,
    isRendered: !isSearchSupported || addressFieldsActive,
  },
  {
    name: 'region',
    Component: FormTextInput,
    isRendered:
      (!isSearchSupported || addressFieldsActive) && !isCountryWithoutRegion(countryCode),
  },
]
