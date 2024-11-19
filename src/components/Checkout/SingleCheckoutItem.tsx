import { TrashIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { ChangeEvent } from 'react'
import { MAX_QUANTITY } from '../../constants/constants'
import { calculateTotalCoffeePrice, roundToTwoDecimals } from '../../helpers/price-calculation'
import { CartItem } from '../../types'

const SingleCheckoutItem = ({
	cartItem,
	onQuantityChange,
	onRemoveItem
}: {
	cartItem: CartItem
	onQuantityChange: (e: ChangeEvent<HTMLSelectElement>) => void
	onRemoveItem: () => void
}) => {
	return (
		<li
			key={cartItem.product.id}
			className='flex px-4 py-6 sm:px-6'>
			<div className='flex flex-shrink-0 items-center rounded-md bg-amber-50'>
				<Image
					src={cartItem.product.imageUrl}
					alt={cartItem.product.name}
					className='w-20 rounded-md'
					width={80}
					height={80}
				/>
			</div>

			<div className='ml-6 flex flex-1 flex-col'>
				<div className='flex'>
					<div className='min-w-0 flex-1'>
						<h4 className='text-base'>
							<a
								href={`/product/${cartItem.product.id}`}
								className='font-medium text-gray-700 hover:text-gray-800'>
								{cartItem.product.name}
							</a>
						</h4>
						<p className='mt-1 text-sm text-gray-500'>{cartItem.size.bagSize.weightInGrams}g</p>
					</div>

					<div className='ml-4 flow-root flex-shrink-0'>
						<button
							type='button'
							className='-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500'
							onClick={onRemoveItem}>
							<span className='sr-only'>Remove</span>
							<TrashIcon
								className='h-5 w-5'
								aria-hidden='true'
							/>
						</button>
					</div>
				</div>

				<div className='flex flex-1 items-end justify-between'>
					<p className='font-lora text-base font-semibold text-gray-900'>
						$
						{roundToTwoDecimals(
							calculateTotalCoffeePrice(
								cartItem.product.pricePerKilo,
								cartItem.quantity,
								cartItem.size.bagSize
							)
						)}{' '}
						USD
					</p>

					<div className='ml-4'>
						<label
							htmlFor='quantity'
							className='sr-only'>
							Quantity
						</label>
						<select
							id='quantity'
							name='quantity'
							value={cartItem.quantity}
							className='rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm'
							onChange={onQuantityChange}>
							{Array.from(
								Array(
									cartItem.product.coffeeBagSizes.find(
										(coffeeBagSize) => coffeeBagSize.bagSize.id === cartItem.size.bagSize.id
									)?.quantity ?? MAX_QUANTITY
								).keys()
							).map((quantity) => (
								<option
									key={quantity}
									value={quantity + 1}>
									{quantity + 1}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</li>
	)
}

export default SingleCheckoutItem
