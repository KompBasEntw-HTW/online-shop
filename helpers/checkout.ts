import {
  CheckoutState,
  CartItem,
  CheckoutItem,
  PersistedShippingAddressType,
  ShippingAddressType,
  Order
} from '../types'
import { ShippingAddress, PaymentMethodDetails, ShippingMethod, Email } from '../constants/zod'
import { isLoggedInUserCheckoutState } from './type-helpers'

export const isValidCheckoutState = (state: CheckoutState) => {
  try {
    if (isLoggedInUserCheckoutState(state)) {
      ShippingAddress.parse(state.shippingAddress)
      PaymentMethodDetails.parse(state.paymentDetails)
      ShippingMethod.parse(state.selectedShippingMethod)
    } else {
      Email.parse(state.email)
      ShippingAddress.parse(state.shippingAddress)
      PaymentMethodDetails.parse(state.paymentDetails)
      ShippingMethod.parse(state.selectedShippingMethod)
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export const basketItemsToCheckoutItems = (items: CartItem[]): CheckoutItem[] =>
  items.map(item => {
    return {
      itemId: {
        productId: item.product.id,
        bagSizeId: item.size.bagSize.id
      },
      quantity: item.size.quantity
    }
  })

export const getShippingAddresses = async (
  accessToken?: string | null
): Promise<PersistedShippingAddressType[] | undefined> => {
  try {
    const data = await fetch('/api/checkout-service/addresses', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const addresses: PersistedShippingAddressType[] = await data.json()
    return addresses
  } catch (error) {
    console.log(error)
  }
}

export const saveShippingAddress = async (
  shippingAddress: ShippingAddressType,
  accessToken?: string | null,
  userEmail?: string
): Promise<number | undefined> => {
  if (accessToken) {
    try {
      const response = await fetch('/api/checkout-service/addresses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(shippingAddress)
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      const response = await fetch('/api/checkout-service/addresses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...shippingAddress, userName: userEmail })
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }
}

export const placeOrder = async (
  checkoutItems: CheckoutItem[],
  addressId: number,
  accessToken?: string | null,
  userEmail?: string
): Promise<Order | undefined> => {
  if (accessToken) {
    try {
      const data = await fetch('/api/checkout-service/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          items: checkoutItems,
          addressId,
          userEmail
        })
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  } else if (userEmail) {
    try {
      const data = await fetch('/api/checkout-service/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: checkoutItems,
          addressId,
          userEmail
        })
      })

      return await data.json()
    } catch (error) {
      console.log(error)
    }
  }
}
