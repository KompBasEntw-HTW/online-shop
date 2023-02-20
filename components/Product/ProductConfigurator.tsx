import { useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'

import { Coffee, CoffeeBagSize, BasketItem } from '../../types'
import clsx from 'clsx'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { useCartContext } from '../../context/CartContext'

import { MAX_QUANTITY, MIN_QUANTITY } from '../../constants/constants'

import {
  calculatePricePerKilo,
  calculateTotalCoffeePrice,
  roundToTwoDecimals
} from '../../helpers/price-calculation'

import { verifyQuantity } from '../../helpers/cart'

const clearAndSortBagSizes = (bagSizes: CoffeeBagSize[]) => {
  const sortedBagSizes = bagSizes.sort((a, b) => a.bagSize.weightInGrams - b.bagSize.weightInGrams)

  return sortedBagSizes.filter(bagSize => bagSize.quantity > 0)
}

const ProductConfigurator = ({
  product,
  className,
  onShowToast
}: {
  product: Coffee
  className?: string
  onShowToast: () => void
}) => {
  const clearedAndSortedBagSizes = clearAndSortBagSizes(product.coffeeBagSizes)

  const [size, setSize] = useState<CoffeeBagSize>(clearedAndSortedBagSizes[0])
  const [maxQuantity, setMaxQuantity] = useState(size.quantity)
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState({
    error: false,
    message: ''
  })

  const cartContext = useCartContext()

  useEffect(() => {
    try {
      verifyQuantity(quantity, maxQuantity)

      setError({
        error: false,
        message: ''
      })

      setTotalPrice(calculateTotalCoffeePrice(product.pricePerKilo, quantity, size.bagSize))
    } catch (err) {
      setError({
        error: true,
        message: (err as Error).message
      })
    }
  }, [size, quantity, product.pricePerKilo, maxQuantity])

  const handleAddToCart = () => {
    try {
      verifyQuantity(quantity, maxQuantity)

      const basketItem: BasketItem[] = [
        {
          item: {
            bagSizeId: size.bagSize.id,
            productId: product.id
          },
          quantity: quantity
        }
      ]

      cartContext.addItem(basketItem)
      onShowToast()
    } catch (err) {
      setError({
        error: true,
        message: (err as Error).message
      })
    }
  }

  return (
    <div className={clsx('min-w-xs rounded-lg border border-zinc-200 bg-zinc-50 p-4', className)}>
      <RadioGroup
        className='product-size-list'
        value={size}
        onChange={(size: CoffeeBagSize) => {
          setSize(size)
          setMaxQuantity(size.quantity)
          setQuantity(1)
        }}>
        <RadioGroup.Label className='sr-only'>Choose your product variation</RadioGroup.Label>
        <div className='grid grid-cols-2 gap-1'>
          {clearedAndSortedBagSizes.map(size => (
            <RadioGroup.Option
              key={size.bagSize.id}
              value={size}
              className='product-size-option hover:cursor-pointer'>
              {({ checked }) => (
                <div
                  className={clsx(
                    `col-span-1 rounded-lg border py-2 px-3 hover:border-amber-400 hover:bg-amber-50`,
                    checked
                      ? 'border-2 border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-2 bg-white text-zinc-700'
                  )}>
                  <h3 className='text-lg'>{size.bagSize.weightInGrams}g</h3>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className='pt-4'>
        <label htmlFor='quantity' className='sr-only'>
          Quantity
        </label>
        <p className='text-xs'>Select a quantity:</p>
        <input
          type='number'
          name='quantity'
          id='quantity'
          min={MIN_QUANTITY}
          max={maxQuantity > MAX_QUANTITY ? MAX_QUANTITY : maxQuantity}
          className='mt-1 block w-full rounded-md border border-zinc-200 px-2 py-1 focus:border-amber-400 focus:ring-amber-400'
          placeholder='Quantity'
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value))}
        />
        {error.error && (
          <p
            className='pb-2 pt-1.5 text-xs text-zinc-500 underline decoration-amber-500'
            id='product-configurator-error'>
            {error.message}
          </p>
        )}
      </div>
      <div className='my-2 rounded-md border border-zinc-200 bg-white px-3 py-2'>
        <span>
          <span className='block text-xs font-semibold uppercase tracking-tight text-zinc-400'>
            Total price
          </span>
          <span className='font-lora text-xl font-bold text-zinc-700' id='total-price'>
            ${roundToTwoDecimals(totalPrice)} USD*
          </span>
          {quantity > 0 && (
            <p className='text-xs'>
              $
              {roundToTwoDecimals(
                calculatePricePerKilo(totalPrice, size.bagSize.weightInGrams * quantity)
              )}{' '}
              USD per kilo
            </p>
          )}
        </span>
      </div>
      <button
        disabled={error.error}
        className='mt-2 inline-flex w-full justify-center gap-x-2 rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-zinc-300 disabled:hover:cursor-not-allowed'
        onClick={handleAddToCart}>
        Add to cart
        <ShoppingCartIcon className='h-5 w-5' />
      </button>
      <p className='pt-2 text-center text-xs'>
        *VAT and shipping costs will be calculated at checkout. <br />
      </p>
    </div>
  )
}

export default ProductConfigurator
