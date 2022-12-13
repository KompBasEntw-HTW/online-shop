import { FaceFrownIcon } from '@heroicons/react/24/solid'

const EmptyShopStatePlaceholder = ({ type = 'noResults' }: { type?: 'noResults' | 'error' }) => {
  if (type === 'noResults') {
    return (
      <div className='col flex h-96 flex-col place-items-center justify-center rounded-lg border border-zinc-100 bg-[#fbfbfb] p-12'>
        <div className='flex h-16 w-16 place-content-center place-items-center rounded-full bg-amber-200'>
          <FaceFrownIcon className='place h-12 w-12 text-amber-600' />
        </div>
        <p className='pt-4 font-lora text-4xl font-semibold text-black'>No products found...</p>
        <p className='pt-4 text-gray-600'>
          Try removing some of your filters to find products again.
        </p>
      </div>
    )
  } else {
    return (
      <div className='col flex h-96 flex-col place-items-center justify-center rounded-lg border border-red-100 bg-red-50 p-12'>
        <div className='flex h-16 w-16 place-content-center place-items-center rounded-full bg-red-200'>
          <FaceFrownIcon className='place h-12 w-12 text-red-600' />
        </div>
        <p className='pt-4 font-lora text-4xl font-semibold text-black'>Oops... an error ocurred</p>
        <p className='pt-4 text-gray-600'>Something went wrong. Please try again later.</p>
      </div>
    )
  }
}

export default EmptyShopStatePlaceholder
