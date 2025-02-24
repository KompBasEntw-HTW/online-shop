'use client'
import { Basket, BasketItem, CartItem, Coffee } from '@/types'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type CartContext = {
	cart: CartItem[]
	addItem: (basketItems: BasketItem[], session: Session | null) => void
	updateItems: (basketItems: BasketItem[], session: Session | null) => void
	removeItem: (productId: number, bagSizeId: number, session: Session | null) => void
}

function storeLocalBasket(localBasket: BasketItem[]) {
	localStorage.setItem('basketItems', JSON.stringify(localBasket))
}

function getLocalBasket() {
	const localBasketAsString = localStorage.getItem('basketItems')
	if (localBasketAsString) {
		return JSON.parse(localBasketAsString) as BasketItem[]
	}
	return []
}

async function assembleCartFromBasketItems(
	basketItems: BasketItem[]
): Promise<CartItem[] | undefined> {
	const resCoffees = await fetch('/api/product-service/coffee')
	if (resCoffees.ok) {
		const coffees: Coffee[] = await resCoffees.json()
		return basketItems.map((basketItem) => {
			return {
				product: coffees.filter((coffee) => coffee.id == basketItem.item.productId)[0],
				quantity: basketItem.quantity,
				size: coffees.flatMap((c) =>
					c.coffeeBagSizes.filter((bagSize) => bagSize.bagSize.id == basketItem.item.bagSizeId)
				)[0]
			}
		})
	}
}

async function getCart(session: Session | null): Promise<CartItem[] | undefined> {
	if (session) {
		const localBasket = getLocalBasket()
		if (localBasket.length > 0) {
			await updateItems(localBasket, session)
			localStorage.removeItem('basketItems')
		}
		const resCart = await fetch('/api/basket-service/basket', {
			headers: { Authorization: `Bearer ${session.accessToken}` }
		})
		if (resCart.ok) {
			const basket: Basket = await resCart.json()
			return assembleCartFromBasketItems(basket.basketItems)
		}
	} else {
		return assembleCartFromBasketItems(getLocalBasket())
	}
}

async function updateItems(
	basketItems: BasketItem[],
	session: Session | null
): Promise<CartItem[] | undefined> {
	if (session) {
		const updatedBasketRes = await fetch('/api/basket-service/basket/update', {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(
				basketItems.map((basketItem) => {
					return {
						productId: basketItem.item.productId,
						bagSizeId: basketItem.item.bagSizeId,
						quantity: basketItem.quantity
					}
				})
			)
		})
		if (updatedBasketRes.ok) {
			const updatedBasket: Basket = await updatedBasketRes.json()
			return assembleCartFromBasketItems(updatedBasket.basketItems)
		} else {
			return undefined
		}
	}
	const localBasket = getLocalBasket()

	const itemToAdd = basketItems[0]
	const itemExists = localBasket.find(
		(basketItem) =>
			basketItem.item.productId === itemToAdd.item.productId &&
			basketItem.item.bagSizeId === itemToAdd.item.bagSizeId
	)

	if (itemExists) {
		const updatedBasket = localBasket.map((basketItem) => {
			if (
				basketItem.item.productId === itemToAdd.item.productId &&
				basketItem.item.bagSizeId === itemToAdd.item.bagSizeId
			) {
				return {
					...basketItem,
					quantity: itemToAdd.quantity
				}
			}

			return basketItem
		})

		storeLocalBasket(updatedBasket)
		return getCart(session)
	} else {
		storeLocalBasket([...localBasket, itemToAdd])
		return getCart(session)
	}
}

async function addItem(
	basketItems: BasketItem[],
	session: Session | null
): Promise<CartItem[] | undefined> {
	const cart = await getCart(session)
	if (cart) {
		basketItems.map((basketItem) => {
			return cart.map((item) => {
				if (
					item.size.bagSize.id === basketItem.item.bagSizeId &&
					item.product.id === basketItem.item.productId
				) {
					basketItem.quantity = item.quantity + basketItem.quantity
				}
			})
		})
	}
	return updateItems(basketItems, session)
}

async function removeItem(
	productId: number,
	bagSizeId: number,
	session: Session | null
): Promise<CartItem[] | undefined> {
	if (session) {
		const updatedCartRes = await fetch('/api/basket-service/basket', {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'DELETE',
			body: JSON.stringify({
				productId: productId,
				bagSizeId: bagSizeId
			})
		})
		if (updatedCartRes.ok) {
			const updatedCart: Basket = await updatedCartRes.json()
			return assembleCartFromBasketItems(updatedCart.basketItems)
		}
	}

	const localBasket = getLocalBasket()

	const updatedBasket = localBasket.filter(
		(basketItem) =>
			basketItem.item.bagSizeId !== bagSizeId || basketItem.item.productId !== productId
	)
	storeLocalBasket(updatedBasket)
	return getCart(session)
}

const CartContext = createContext<CartContext>({
	cart: [],
	addItem: addItem,
	updateItems: updateItems,
	removeItem: removeItem
})

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<CartItem[]>([])

	const { data: session } = useSession()

	useEffect(() => {
		getCart(session).then((remoteCart) => {
			if (remoteCart) {
				setCart(remoteCart)
			}
		})
	}, [session])

	return (
		<CartContext.Provider
			value={{
				cart,
				addItem: async (basketItems: BasketItem[]) => {
					const updatedCart = await addItem(basketItems, session)
					if (updatedCart) {
						setCart(updatedCart)
					}
				},
				updateItems: async (basketItems: BasketItem[]) => {
					const updatedCart = await updateItems(basketItems, session)
					if (updatedCart) {
						setCart(updatedCart)
					}
				},
				removeItem: async (productId: number, bagSizeId: number) => {
					const updatedCart = await removeItem(productId, bagSizeId, session)
					if (updatedCart) {
						setCart(updatedCart)
					}
				}
			}}>
			{children}
		</CartContext.Provider>
	)
}

export const useCartContext = () => {
	return useContext(CartContext)
}
