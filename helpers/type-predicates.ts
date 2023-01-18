import { PaymentDetailsType, BankTransferDetailsType, CreditCardDetailsType } from '../types'

export const isBankTransferDetails = (
  obj: PaymentDetailsType | Partial<PaymentDetailsType> | null
): obj is BankTransferDetailsType => obj?.type === 'bank-transfer'

export const isCreditCardDetails = (
  obj: PaymentDetailsType | Partial<PaymentDetailsType> | null
): obj is CreditCardDetailsType => obj?.type === 'credit-card'
