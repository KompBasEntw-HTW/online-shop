import { CoffeeSize } from '../../../types'
import { MAX_QUANTITY, MIN_QUANTITY } from '../../../constants/constants'

export const calculateTotalPrice = (pricePerKilo: number, quantity: number, size: CoffeeSize) => {
  return pricePerKilo * quantity * (1 - size.volumeDiscount) * (size.weightInGrams / 1000)
}

export const calculatePricePerKilo = (totalPrice: number, totalWeight: number) => {
  return (totalPrice / totalWeight) * 1000
}

export const roundToTwoDecimals = (num: number) => {
  return (Math.round(num * 10) / 10).toFixed(2)
}

export const verifyQuantity = (quantity: number) => {
  if (!Number.isInteger(quantity)) {
    throw new Error('Quantity must be a positive integer')
  }
  if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
    throw new Error(`Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}`)
  }

  return true
}
