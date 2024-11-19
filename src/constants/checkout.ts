import {
	BankTransferDetailsType,
	CheckoutState,
	CreditCardDetailsType,
	PaymentDetailsType,
	ShippingAddressType
} from '../types'

import {
	DEFAULT_ADDRESS,
	DEFAULT_CREDIT_CARD_DETAILS,
	SHIPPING_METHODS,
	SUPPORTED_COUNTRIES
} from './constants'

export const testCreditCardDetails: CreditCardDetailsType = {
	type: 'credit-card',
	cardNumber: '1234 5678 9012 3456',
	expirationDate: '12/24',
	cvv: '123',
	cardHolder: 'John Doe'
}

export const testBankTransferDetails: BankTransferDetailsType = {
	type: 'bank-transfer',
	accountHolder: 'John Doe',
	iban: 'DE89370400440532013000',
	bic: 'DEUTDEFF'
}

export const storedPaymentDetailsTest: PaymentDetailsType[] = [
	testBankTransferDetails,
	testCreditCardDetails
]

export const storedShippingAddressesTest: ShippingAddressType[] = [
	{
		firstName: 'John',
		lastName: 'Doe',
		street: 'Main St',
		streetNumber: '123',
		postalCode: '12345',
		city: 'New York',
		country: SUPPORTED_COUNTRIES[0],
		additionalInformation: '1st floor'
	},
	{
		firstName: 'Jane',
		lastName: 'Doe',
		street: 'Peter St',
		streetNumber: '456',
		postalCode: '12345',
		city: 'New York',
		country: SUPPORTED_COUNTRIES[1],
		state: 'NY'
	}
]

export const INITIAL_CHECKOUT_STATE: CheckoutState = {
	selectedShippingMethod: SHIPPING_METHODS[0],
	email: '',
	shippingAddress: DEFAULT_ADDRESS,
	paymentDetails: DEFAULT_CREDIT_CARD_DETAILS
}
