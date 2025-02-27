import { z } from 'zod'
import {
	BankTransferDetails,
	CreditCardDetails,
	Email,
	PersistedShippingAddress,
	ShippingAddress,
	ShippingMethod
} from '../constants/zod'

export type CoffeeSize = {
	id: number
	name: string
	volumeDiscount: number
	weightInGrams: number
}

export type CoffeeBagSize = {
	bagSize: CoffeeSize
	quantity: number
}

export type Coffee = {
	id: number
	name: string
	description: string
	flavor: string
	imageUrl: string
	pricePerKilo: number
	coffeeBagSizes: CoffeeBagSize[]
	flavorNotes: {
		id: number
		flavorNote: string
	}[]
	roastLevel: number
	roaster: string
	roasterNotes: string
	location: string
}

export type SelectedRangeOptions = {
	id: string
	type: 'range'
	min: number
	max: number
}

export type SelectedCheckboxOptions = {
	id: string
	type: 'checkbox'
	values: string[]
}

export type FilterOption = {
	value: string
	name?: string
}

export type CheckboxFilterType = {
	id: string
	name: string
	type: 'checkbox'
	values: FilterOption[]
}

export type RangeFilterType = {
	id: string
	name: string
	type: 'range'
	min: number
	max: number
}

export type ProductFilter = CheckboxFilterType | RangeFilterType

export type SortingsOptionsType = {
	name: string
	value: 'name-alpha' | 'name-reverse-alpha' | 'price-desc' | 'price-asc'
}

export type SelectedFilterOptions = SelectedRangeOptions | SelectedCheckboxOptions

export type ShopState = {
	mobileFiltersOpen: boolean
	availableFilters: ProductFilter[]
	queryState: {
		searchQuery: string
		filters: SelectedFilterOptions[]
		sorting: SortingsOptionsType
	}
	filteredProducts: Coffee[]
}

export type CheckboxFilterUpdatePayload = {
	id: string
	value: string
}

export type RangeFilterUpdatePayload = {
	id: string
	min: number
	max: number
}

export type ShopAction =
	| { type: 'SET_MOBILE_FILTERS_OPEN'; payload: boolean }
	| { type: 'SET_AVAILABLE_FILTERS'; payload: ProductFilter[] }
	| { type: 'SET_FILTERED_PRODUCTS'; payload: Coffee[] }
	| {
			type: 'UPDATE_CHECKBOX_FILTER'
			payload: CheckboxFilterUpdatePayload
	  }
	| {
			type: 'UPDATE_RANGE_FILTER'
			payload: RangeFilterUpdatePayload
	  }
	| {
			type: 'UPDATE_SEARCH_QUERY'
			payload: string
	  }
	| {
			type: 'UPDATE_APPLIED_SORTING'
			payload: SortingsOptionsType
	  }
	| {
			type: 'RESET_FILTERS'
	  }

export type CartItem = {
	product: Coffee
	quantity: number
	size: CoffeeBagSize
}

export type BasketItem = {
	item: {
		bagSizeId: number
		productId: number
		quantityInStock?: number
	}
	quantity: number
}

export type CheckoutItem = {
	itemId: {
		productId: number
		bagSizeId: number
	}
	quantity: number
}

export type Basket = {
	id: string
	userName: string
	basketItems: BasketItem[]
}

export type CreditCardDetailsType = z.infer<typeof CreditCardDetails>
export type BankTransferDetailsType = z.infer<typeof BankTransferDetails>
export type PaymentDetailsType = CreditCardDetailsType | BankTransferDetailsType
export type PersistedShippingAddressType = z.infer<typeof PersistedShippingAddress>

export type ShippingMethodType = z.infer<typeof ShippingMethod>
export type ShippingAddressType = z.infer<typeof ShippingAddress>
export type EmailType = z.infer<typeof Email>

export type LoggedInUserCheckoutState = {
	selectedShippingMethod: ShippingMethodType
	persistedShippingAddresses: PersistedShippingAddressType[] | []
	shippingAddress: ShippingAddressType | PersistedShippingAddressType
	persistedPaymentDetails: PaymentDetailsType[] | []
	paymentDetails: PaymentDetailsType
}

export type LoggedOutUserCheckoutState = {
	selectedShippingMethod: ShippingMethodType
	email: EmailType
	shippingAddress: ShippingAddressType
	paymentDetails: PaymentDetailsType
}

export type CheckoutState = LoggedInUserCheckoutState | LoggedOutUserCheckoutState

export type CheckoutReducerAction =
	| {
			type: 'RESET_CHECKOUT'
			payload: LoggedInUserCheckoutState | LoggedOutUserCheckoutState
	  }
	| { type: 'SET_SHIPPING_ADDRESS'; payload: ShippingAddressType }
	| { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethodType }
	| {
			type: 'SET_PAYMENT_DETAILS'
			payload: PaymentDetailsType
	  }
	| {
			type: 'SAVE_NEW_SHIPPING_ADDRESS'
			payload: ShippingAddressType
	  }
	| {
			type: 'SET_PERSISTED_SHIPPING_ADDRESSES'
			payload: PersistedShippingAddressType[]
	  }
	| { type: 'SET_EMAIL'; payload: EmailType }
	| { type: 'SUBMIT_ORDER' }

export type PositionStackAPIResponse = {
	data: {
		latitude: number
		longitude: number
	}[]
}

export type Item = {
	productId: number
	bagSizeId: number
}

export type ItemId = {
	productId: number
	bagSizeId: number
}

export type OrderItem = {
	id: number
	quantity: number
	item: Item
}

export type Order = {
	canceled: boolean
	id: number
	orderDateTime: string
	orderItems: OrderItem[]
	orderDetails: {
		subtotal: number
		shipping: number
		tax: number
		total: number
	}
	userName: string
	valid: false
}

export type CoffeeWithSelectedSize = Coffee &
	Omit<OrderItem, 'item'> & {
		selectedBagSize: CoffeeBagSize
	}

export type OrderWithProductsData = Omit<Order, 'orderItems'> & {
	orderItems: (CoffeeWithSelectedSize | undefined)[]
}
