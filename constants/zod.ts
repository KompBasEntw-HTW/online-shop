import z from 'zod'
import { SUPPORTED_COUNTRIES } from './constants'

export const CreditCardDetails = z.object({
  type: z.literal('credit-card'),
  cardNumber: z
    .string()
    .trim()
    .refine(
      value => {
        const valueWithoutSpaces = value.replace(/\s/g, '')

        const regex = new RegExp('^[0-9]{16}$')
        return regex.test(valueWithoutSpaces)
      },
      {
        message: 'Card number must be 16 digits. Example: 1234 5678 9012 3456'
      }
    ),
  // create a variable for the expiration date and make sure it's in the format (MM/YY)
  expirationDate: z
    .string()
    .trim()
    .refine(
      value => {
        const valueWithoutSpaces = value.replace(/\s/g, '')
        const regex = new RegExp('^[0-9]{2}/[0-9]{2}$')
        return regex.test(valueWithoutSpaces)
      },
      {
        message: 'Expiration date must be in the format (MM/YY). Example: 01/22'
      }
    ),

  cvv: z
    .string()
    .trim()
    .refine(
      value => {
        const valueWithoutSpaces = value.replace(/\s/g, '')
        const regex = new RegExp('^[0-9]{3}$')
        return regex.test(valueWithoutSpaces)
      },
      {
        message: 'CVV must be 3 digits. Example: 123'
      }
    ),
  cardHolder: z
    .string()
    .min(1)
    .trim()
    .refine(
      value => {
        const regex = new RegExp('^[a-zA-Z ]+$')
        return regex.test(value)
      },
      {
        message: 'Card holder name must only contain letters and spaces. Example: John Doe'
      }
    ),
  saveToDatabase: z.boolean().optional()
})

export const BankTransferDetails = z.object({
  type: z.literal('bank-transfer'),
  iban: z
    .string()
    .min(1)
    .trim()
    .refine(
      value => {
        const valueWithoutSpaces = value.replace(/\s/g, '')
        const regex = new RegExp('[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}')
        return regex.test(valueWithoutSpaces)
      },
      {
        message: 'IBAN is not valid. Example: DE89 3704 0044 0532 0130 00'
      }
    ),
  bic: z
    .string()
    .trim()
    .refine(
      value => {
        const valueWithoutSpacesAndUppercase = value.replace(/\s/g, '').toUpperCase()

        const regex = new RegExp(/^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/)
        return regex.test(valueWithoutSpacesAndUppercase)
      },
      {
        message: 'BIC is not valid. Example: DEUTDEDBBER'
      }
    ),
  accountHolder: z.string().min(1).trim(),
  saveToDatabase: z.boolean().optional()
})

export const PaymentMethodDetails = z.union([CreditCardDetails, BankTransferDetails])

export const ShippingAddress = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  apartment: z.string().optional(),
  zip: z.string().min(1),
  state: z.string().optional(),
  city: z.string().min(1),
  country: z.enum(SUPPORTED_COUNTRIES),
  saveToDatabase: z.boolean().optional()
})

export const Email = z.string().email({
  message: 'Email is not valid'
})

export const ShippingMethod = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  turnaround: z.string().min(1),
  basePrice: z.number(),
  reducedPrice: z.number()
})
