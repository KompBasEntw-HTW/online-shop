import { CartItem, CoffeeSize } from '../types'

export const calculateTotalCoffeePrice = (
	pricePerKilo: number,
	quantity: number,
	size: CoffeeSize
) => {
	return pricePerKilo * quantity * (1 - size.volumeDiscount) * (size.weightInGrams / 1000)
}

export const calculatePricePerKilo = (totalPrice: number, totalWeight: number) => {
	return (totalPrice / totalWeight) * 1000
}

export const roundToTwoDecimals = (num: number) => {
	return (Math.round(num * 10) / 10).toFixed(2)
}

export const calculateSubtotal = (cartItems: CartItem[]) => {
	return cartItems.reduce(
		(total, cartItem) =>
			total +
			calculateTotalCoffeePrice(
				cartItem.product.pricePerKilo,
				cartItem.quantity,
				cartItem.size.bagSize
			),
		0
	)
}

export const calculateHasDiscountedShipping = (
	subtotal: number,
	discountedShippingThreshold: number
) => subtotal >= discountedShippingThreshold

export const calculateShippingCost = (
	hasDiscountedShippingCost: boolean,
	discountedCost: number,
	standardCost: number
) => (hasDiscountedShippingCost ? discountedCost : standardCost)

export const calculateTax = (subtotal: number, shippingCost: number, taxRate: number) => {
	return (subtotal + shippingCost) * taxRate
}

export const calculateTotal = (subtotal: number, shippingCost: number, tax: number) => {
	return subtotal + shippingCost + tax
}
