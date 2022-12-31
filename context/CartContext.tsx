import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { CartItem } from '../types'

type CartContext = {
  cart: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number, bagSizeId: number) => void
}

const getCart = () => {
  return localStorage.getItem('cart')
}

const addToLocalCart = (cartItem: CartItem) => {
  const cart = getCart()

  if (!cart) {
    localStorage.setItem('cart', JSON.stringify([cartItem]))
  } else {
    const parsedCart = JSON.parse(cart)

    const itemExists = parsedCart.find(
      (item: CartItem) =>
        item.product.id === cartItem.product.id && item.size.bagSize.id === cartItem.size.bagSize.id
    )

    if (itemExists) {
      const updatedCart = parsedCart.map((item: CartItem) => {
        if (
          item.product.id === cartItem.product.id &&
          item.size.bagSize.id === cartItem.size.bagSize.id
        ) {
          return {
            ...item,
            quantity: item.quantity + cartItem.quantity
          }
        }

        return item
      })

      localStorage.setItem('cart', JSON.stringify(updatedCart))
    } else {
      localStorage.setItem('cart', JSON.stringify([...parsedCart, cartItem]))
    }
  }
}

const removeFromLocalCart = (productId: number, bagSizeId: number) => {
  const cart = getCart()

  if (cart) {
    const parsedCart = JSON.parse(cart)

    const updatedCart = parsedCart.filter(
      (item: CartItem) => item.product.id !== productId || item.size.bagSize.id !== bagSizeId
    )

    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }
}

const CartContext = createContext<CartContext>({
  cart: [],
  addItem: addToLocalCart,
  removeItem: removeFromLocalCart
})

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const cart = localStorage.getItem('cart')

    setCart(cart ? JSON.parse(cart) : [])
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem: (item: CartItem) => {
          addToLocalCart(item)
          setCart(
            localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as string) : []
          )
        },
        removeItem: (productId: number, bagSizeId: number) => {
          removeFromLocalCart(productId, bagSizeId)
          setCart(
            localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart') as string) : []
          )
        }
      }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  return useContext(CartContext)
}
