import Image from 'next/image'
import Link from 'next/link'
import { CoffeeProductData } from '../../types'
import Tag from '../General/Tag'

const SingleProduct = ({ product }: { product: CoffeeProductData }) => {
  const formattedPrice = product.price.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })

  return (
    <div
      key={product.id}
      className='group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white'>
      <div className='bg-amber-50 group-hover:opacity-90'>
        <Image
          src={product.imageUrl}
          alt={`${product.name} image`}
          className='object-center sm:h-full sm:w-full'
          width={300}
          height={300}
        />
      </div>
      <div className='flex flex-1 flex-col space-y-2 p-4 group-hover:bg-zinc-50'>
        <h3 className='font-lora text-xl font-bold text-gray-900'>
          <Link href={`/products/${product.id}`}>
            <span aria-hidden='true' className='absolute inset-0' />
            {product.name}
          </Link>
        </h3>
        <div className='flex flex-wrap divide-x divide-dotted'>
          {product.flavorNotes.map((flavorNote, index) => (
            <span className='px-1 text-xs font-semibold text-gray-600'>
              {flavorNote.flavorNote}
            </span>
          ))}
        </div>
        <p className='text-sm text-gray-500 line-clamp-3'>{product.description}</p>
        <div className='flex gap-x-1'>
          <Tag content={`Roast level: ${product.roastLevel.toString()}`} />
          <Tag content={product.flavor} />
        </div>
        <span className='text-md pt-2 font-lora font-extrabold text-gray-900 underline decoration-amber-400'>
          ${formattedPrice} USD
        </span>
      </div>
    </div>
  )
}

export default SingleProduct
