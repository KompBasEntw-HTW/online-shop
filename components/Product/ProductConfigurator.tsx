import { useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'

import { Coffee, CoffeeSize } from '../../types'
import clsx from 'clsx'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'

type CartItem = {}

const ProductConfigurator = ({
  product,
  onAddToCart,
  className
}: {
  product: Coffee
  onAddToCart: (item: CartItem) => void
  className?: string
}) => {
  console.log(product)
  const [size, setSize] = useState<CoffeeSize>(product.availableBagSizes[0])
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setTotalPrice(
      Math.round(
        product.pricePerKilo *
          quantity *
          (1 - size.volumeDiscount) *
          (size.weightInGrams / 1000) *
          100
      ) / 100
    )
  }, [size, quantity])

  const handleAddToCart = () => {
    onAddToCart('')
  }

  console.log(size, quantity, totalPrice)

  const sortedBagSizes = product.availableBagSizes.sort((a, b) => a.weightInGrams - b.weightInGrams)

  return (
    <div className={clsx('max-w-xs rounded-lg border border-zinc-200 bg-zinc-50 p-4', className)}>
      <RadioGroup value={size} onChange={setSize}>
        <RadioGroup.Label className='sr-only'>Choose your product variation</RadioGroup.Label>
        <div className='grid grid-cols-2 gap-1'>
          {sortedBagSizes.map((size, id) => (
            <RadioGroup.Option
              key={size.id}
              value={size}
              className='hover:cursor-pointer'
              defaultChecked={id === 0}>
              {({ checked }) => (
                <div
                  className={clsx(
                    `col-span-1 rounded-lg border py-2 px-3 hover:border-amber-400 hover:bg-amber-50`,
                    checked
                      ? 'border-2 border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-2 bg-white text-zinc-700'
                  )}>
                  <h3 className='text-lg'>{size.weightInGrams}g</h3>
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
          min={1}
          max={20}
          className='mt-1 block w-full rounded-md border border-zinc-200 px-2 py-1 focus:border-amber-400 focus:ring-amber-400'
          placeholder='Quantity'
          value={quantity}
          onChange={e => setQuantity(parseInt(e.target.value))}
        />
      </div>
      <div className='my-2 rounded-md border border-zinc-200 bg-white px-3 py-2'>
        <span>
          <span className='block text-xs font-semibold uppercase tracking-tight text-zinc-400'>
            Total price
          </span>
          <span className='font-lora text-xl font-bold text-zinc-700'>${totalPrice} USD</span>
          <p className='text-xs'>
            ${Math.round((totalPrice / (size.weightInGrams * quantity)) * 1000 * 100) / 100} USD per
            kilo
          </p>
        </span>
      </div>
      <button
        className='mt-2 inline-flex w-full justify-center gap-x-2 rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
        onClick={handleAddToCart}>
        Add to cart
        <ShoppingCartIcon className='h-5 w-5' />
      </button>
    </div>
  )
}

export default ProductConfigurator
