import {
  ShippingMethodType,
  ShippingAddressType,
  CreditCardDetailsType,
  BankTransferDetailsType
} from '../types'

export const MAX_QUANTITY = 25
export const MIN_QUANTITY = 1
export const FREE_SHIPPING_THRESHOLD = 100
export const STANDARD_SHIPPING_COST = 5
export const EXPRESS_SHIPPING_COST = 10
export const DISCOUNTED_STANDARD_SHIPPING_COST = 0
export const DISCOUNTED_EXPRESS_SHIPPING_COST = 5
export const AVAILABLE_PAYMENT_METHODS = [
  {
    id: 'credit-card',
    title: 'Credit card'
  },
  {
    id: 'bank-transfer',
    title: 'Bank transfer'
  }
]

export const SHIPPING_METHODS: ShippingMethodType[] = [
  {
    id: 'standard',
    title: 'Standard',
    turnaround: '4–10 business days',
    basePrice: STANDARD_SHIPPING_COST,
    reducedPrice: DISCOUNTED_STANDARD_SHIPPING_COST
  },
  {
    id: 'express',
    title: 'Express',
    turnaround: '2–5 business days',
    basePrice: EXPRESS_SHIPPING_COST,
    reducedPrice: DISCOUNTED_EXPRESS_SHIPPING_COST
  }
]

export const SUPPORTED_COUNTRIES = ['Germany', 'Switzerland', 'Austria'] as const

export const DEFAULT_ADDRESS: ShippingAddressType = {
  firstName: '',
  lastName: '',
  street: '',
  streetNumber: '',
  additionalInformation: '',
  postalCode: '',
  state: '',
  city: '',
  country: SUPPORTED_COUNTRIES[0]
}

export const DEFAULT_CREDIT_CARD_DETAILS: CreditCardDetailsType = {
  type: 'credit-card',
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  cardHolder: ''
}

export const DEFAULT_BANK_TRANSFER_DETAILS: BankTransferDetailsType = {
  type: 'bank-transfer',
  accountHolder: '',
  iban: '',
  bic: ''
}
