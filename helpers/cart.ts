import { CartItem } from '../types'
import { MIN_QUANTITY } from '../constants/constants'

export const sortCartItems = (cartItems: CartItem[]) =>
  cartItems.sort((a, b) => {
    if (a.product.name < b.product.name) {
      return -1
    } else if (a.product.name > b.product.name) {
      return 1
    } else if (a.size.bagSize.weightInGrams < b.size.bagSize.weightInGrams) {
      return 1
    } else {
      return -1
    }
  })

export const verifyQuantity = (quantity: number, maxQuantity: number) => {
  if (
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity < MIN_QUANTITY ||
    quantity > maxQuantity
  ) {
    throw new Error(`Quantity must be between ${MIN_QUANTITY} and ${maxQuantity}`)
  }

  return true
}
