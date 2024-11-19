import {
	BankTransferDetailsType,
	CheckoutState,
	CreditCardDetailsType,
	LoggedInUserCheckoutState,
	LoggedOutUserCheckoutState,
	PaymentDetailsType
} from '../types'

export const isBankTransferDetails = (
	obj: PaymentDetailsType | Partial<PaymentDetailsType> | null
): obj is BankTransferDetailsType => obj?.type === 'bank-transfer'

export const isCreditCardDetails = (
	obj: PaymentDetailsType | Partial<PaymentDetailsType> | null
): obj is CreditCardDetailsType => obj?.type === 'credit-card'

export const isLoggedInUserCheckoutState = (
	state: CheckoutState
): state is LoggedInUserCheckoutState =>
	(state as LoggedInUserCheckoutState).persistedShippingAddresses !== undefined

export const isLoggedOutUserCheckoutState = (
	state: CheckoutState
): state is LoggedOutUserCheckoutState => (state as LoggedOutUserCheckoutState).email !== undefined
