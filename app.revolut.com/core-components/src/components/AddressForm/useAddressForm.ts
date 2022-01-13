import { useFormik } from 'formik'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'

import { I18nNamespace, KeyboardKey, useEventListener } from '@revolut/rwa-core-utils'
import {
  useCountryTranslations,
  getFormattedSupportedCountries,
} from '@revolut/rwa-core-i18n'
import { useCommonConfig } from '@revolut/rwa-core-api'

import { INITIAL_VALUES } from './constants'
import { createFormSchema } from './form'
import { AddressFieldsProps, AddressFormValues, UseAddressFormArgs } from './types'

const validateFormValues = (values: AddressFormValues, isPostCodeSupported: boolean) => {
  return (
    !isEmpty(values.country) &&
    !isEmpty(values.addressLine1) &&
    !isEmpty(values.city) &&
    (!isPostCodeSupported || !isEmpty(values.postCodeSearch) || !isEmpty(values.postCode))
  )
}

export const useAddressForm = ({
  initialCountry,
  initialValues,
  onSubmit,
}: UseAddressFormArgs) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const [addressFieldsActive, setAddressFieldsActive] = useState(false)
  const isInitialCountryChangedRef = useRef(false)
  const [configData, isConfigFetching] = useCommonConfig()
  const getCountryTranslation = useCountryTranslations()

  const handleFormikSubmit = useCallback(
    (values: AddressFormValues) => {
      const isPostCodeSupported = !configData?.countriesWithoutZip?.includes(
        values.country,
      )

      if (validateFormValues(values, isPostCodeSupported)) {
        onSubmit(values)
      }
    },
    [configData, onSubmit],
  )

  const handleFormReset = useCallback(() => {
    isInitialCountryChangedRef.current = false
  }, [])

  const formInitialValues: AddressFormValues = initialValues
    ? {
        ...INITIAL_VALUES,
        ...initialValues,
        postCodeSearch: initialValues.postCode,
      }
    : {
        ...INITIAL_VALUES,
        country: initialCountry,
      }

  const {
    values: formikValues,
    handleSubmit,
    handleChange: handleFormikChange,
    setFieldValue,
    setValues,
    resetForm,
  } = useFormik<AddressFormValues>({
    enableReinitialize: true,
    initialValues: formInitialValues,
    onSubmit: handleFormikSubmit,
    onReset: handleFormReset,
  })

  const isPostCodeLookupSupported =
    configData?.postcodeSearchCountries?.includes(formikValues.country) ?? false

  const isAddressSearchSupported =
    !isPostCodeLookupSupported &&
    (configData?.addressSearchCountries?.includes(formikValues.country) ?? false)

  const isPostCodeSupported = !configData?.countriesWithoutZip?.includes(
    formikValues.country,
  )

  const isSearchSupported = isPostCodeLookupSupported || isAddressSearchSupported

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.Enter) {
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  useEventListener('keydown', onKeyDown)

  useEffect(() => {
    if (formikValues.postCodeSearch) {
      setAddressFieldsActive(true)
      if (isObject(formikValues.postCodeSearch)) {
        setValues({
          ...INITIAL_VALUES,
          country: formikValues.country,
          postCode: formikValues.postCodeSearch.postcode,
          postCodeSearch: formikValues.postCodeSearch,
          addressLine1: formikValues.postCodeSearch.streetLine1,
          city: formikValues.postCodeSearch.city,
        })
      } else if (formikValues.postCodeSearch !== initialValues?.postCode) {
        setValues({
          ...INITIAL_VALUES,
          country: formikValues.country,
          postCode: formikValues.postCodeSearch,
          postCodeSearch: formikValues.postCodeSearch,
        })
      }
    }
  }, [
    formikValues.country,
    formikValues.postCodeSearch,
    initialValues?.postCode,
    setValues,
  ])

  useEffect(() => {
    if (isEmpty(formikValues.addressSearch) && isEmpty(formikValues.postCodeSearch)) {
      setAddressFieldsActive(true)
      setValues({
        ...INITIAL_VALUES,
        country: formikValues.country,
      })
    } else if (formikValues.addressSearch?.postcode) {
      setAddressFieldsActive(true)
      setValues({
        ...INITIAL_VALUES,
        addressSearch: formikValues.addressSearch,
        country: formikValues.country,
        postCode: formikValues.addressSearch.postcode,
        addressLine1: formikValues.addressSearch.streetLine1,
        city: formikValues.addressSearch.city,
        region: formikValues.addressSearch.region,
      })
    }
  }, [
    formikValues.country,
    formikValues.addressSearch,
    setValues,
    formikValues.postCodeSearch,
  ])

  useEffect(() => {
    if (
      formikValues.country &&
      (formikValues.country !== initialValues?.country ||
        isInitialCountryChangedRef.current)
    ) {
      isInitialCountryChangedRef.current = true

      setAddressFieldsActive(false)
      setValues({
        ...INITIAL_VALUES,
        country: formikValues.country,
      })
    }
  }, [formikValues.country, initialValues, initialValues?.country, setValues])

  useEffect(() => {
    if (formikValues.postCode) {
      setFieldValue('postCode', formikValues.postCode.toUpperCase())
    }
  }, [formikValues.postCode, setFieldValue])

  const isRequiredFieldsFilled = validateFormValues(formikValues, isPostCodeSupported)

  const formSchema = useMemo(
    () =>
      createFormSchema({
        countryCode: formikValues.country,
        isPostCodeSupported,
        isAddressSearchSupported,
        isPostCodeLookupSupported,
        isSearchSupported,
        addressFieldsActive,
      }),
    [
      addressFieldsActive,
      formikValues.country,
      isAddressSearchSupported,
      isPostCodeLookupSupported,
      isPostCodeSupported,
      isSearchSupported,
    ],
  )

  const formFieldComponentProps = useMemo<AddressFieldsProps>(
    () => ({
      country: {
        options: getFormattedSupportedCountries({
          getCountryTranslation,
        }),
        isFetching: isConfigFetching,
        placeholder: t('address.fields.country'),
      },
      postCodeSearch: {
        initialIsOpen: !initialValues,
        countryCode: formikValues.country,
      },
      addressSearch: {
        initialIsOpen: !initialValues,
        countryCode: formikValues.country,
      },
      addressLine1: {
        autoFocus: !isAddressSearchSupported && !isPostCodeLookupSupported,
        placeholder: t('address.fields.addressLine1'),
      },
      addressLine2: {
        placeholder: t('address.fields.addressLine2'),
      },
      postCode: {
        placeholder: t('address.fields.postCode'),
      },
      city: {
        placeholder: t('address.fields.city'),
      },
      region: {
        placeholder: t('address.fields.region'),
      },
    }),
    [
      formikValues.country,
      getCountryTranslation,
      initialValues,
      isAddressSearchSupported,
      isConfigFetching,
      isPostCodeLookupSupported,
      t,
    ],
  )

  return {
    formSchema,
    formValues: formikValues,
    formFieldComponentProps,
    isRequiredFieldsFilled,
    handleFieldChange: handleFormikChange,
    handleFormSubmit: handleSubmit,
    resetForm,
  }
}
