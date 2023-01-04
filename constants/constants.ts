import { DeliveryMethod, PaymentMethod } from '../types'

export const MAX_QUANTITY = 25
export const MIN_QUANTITY = 1
export const FREE_SHIPPING_THRESHOLD = 100

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'standard',
    title: 'Standard',
    turnaround: '4–10 business days',
    basePrice: 5,
    reducedPrice: 0
  },
  {
    id: 'express',
    title: 'Express',
    turnaround: '2–5 business days',
    basePrice: 10,
    reducedPrice: 5
  }
]

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    title: 'Credit card',
    fields: [
      { id: 'card-number', label: 'Card number', type: 'text' },
      { id: 'card-expiration', label: 'Expiration date', type: 'text' },
      { id: 'card-cvv', label: 'CVV', type: 'text' },
      { id: 'card-name', label: 'Name on card', type: 'text' }
    ]
  },
  {
    id: 'bank-transfer',
    title: 'Bank transfer',
    fields: [
      { id: 'iban', label: 'IBAN', type: 'text' },
      { id: 'bic', label: 'BIC', type: 'text' },
      { id: 'account-holder', label: 'Account holder', type: 'text' }
    ]
  }
]

export const supportedCountries = [
  {
    id: 'de',
    name: 'Germany'
  },
  {
    id: 'at',
    name: 'Austria'
  },
  {
    id: 'ch',
    name: 'Switzerland'
  }
]
