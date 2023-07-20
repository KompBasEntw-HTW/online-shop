import Link from 'next/link'
import Image from 'next/image'
import { formatDate, addToDate } from '../../helpers/utilities'
import { OrderWithProductsData } from '../../types'

const SingleOrder = ({ order }: { order: OrderWithProductsData }) => {
  return (
    <div key={order.id} className='rounded-md border border-zinc-200 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-4'>
          <h3 className='text-xl'>
            Order from {formatDate(new Date(order.orderDateTime.replace('[GMT]', '')))}
          </h3>
          <span className='rounded-md bg-amber-50 px-2 py-0.5 text-sm  text-amber-600'>
            Delivered on{' '}
            {formatDate(addToDate(new Date(order.orderDateTime.replace('[GMT]', '')), 3))}
          </span>
        </div>
        <span className='text-gray-500'>Order id: {order.id}</span>
      </div>

      <div className='grid grid-cols-3 gap-4 pt-4'>
        {order.orderItems?.map((item, idx) => (
          <Link key={idx} href={`/products/${item?.id}`}>
            <div className='flex gap-x-4 rounded-md border border-zinc-200 bg-zinc-50 hover:cursor-pointer hover:border-zinc-300'>
              <div className='shrink-0 rounded-xl bg-amber-50'>
                <Image src={item?.imageUrl || ''} alt={item?.name || ''} width={80} height={80} />
              </div>
              <div className='flex flex-col justify-center px-1'>
                <h4 className='line-clamp-1 text-base'>{item?.name}</h4>
                <p className='text-sm text-gray-500'>
                  {item?.selectedBagSize.bagSize.weightInGrams}g
                </p>
                <p className='text-sm text-gray-500'>{item?.quantity}x</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SingleOrder
