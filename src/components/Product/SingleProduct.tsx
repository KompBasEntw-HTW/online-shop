import Image from 'next/image'
import Link from 'next/link'

import Tag from '@/components/General/Tag'

import { Coffee } from '@/types'

const SingleProduct = ({ product }: { product: Coffee }) => {
	const formattedPrice = product.pricePerKilo.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	})

	return (
		<li
			key={product.id}
			className='group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white'>
			<div className='bg-amber-50 group-hover:opacity-90'>
				<Image
					src={product.imageUrl}
					alt={`${product.name} image`}
					className='object-center sm:h-full sm:w-full'
					width={300}
					height={300}
					id='product-image'
				/>
			</div>
			<div className='flex flex-1 flex-col space-y-2 p-4 group-hover:bg-zinc-50'>
				<h3
					className='font-lora text-xl font-bold text-gray-900'
					id='product-title'>
					<Link href={`/products/${product.id}`}>
						<span
							aria-hidden='true'
							className='absolute inset-0'
						/>
						{product.name}
					</Link>
				</h3>
				<div className='flex flex-wrap divide-x divide-dotted'>
					{product.flavorNotes
						.sort((a, b) => a.id - b.id)
						.map((flavorNote, index) => (
							<span
								className='px-1 text-xs font-semibold text-gray-600'
								key={index}>
								{flavorNote.flavorNote}
							</span>
						))}
				</div>
				<p
					className='line-clamp-3 text-sm text-gray-500'
					id='product-description'>
					{product.description}
				</p>
				<div className='flex gap-x-1'>
					<Tag content={`Roast level: ${product.roastLevel.toString()}`} />
					<Tag content={product.flavor} />
				</div>
				<span
					className='text-md pt-2 font-lora font-extrabold text-gray-900 underline decoration-amber-400'
					id='product-price'>
					${formattedPrice} USD
				</span>
			</div>
		</li>
	)
}

export default SingleProduct
