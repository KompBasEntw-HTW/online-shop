import { Layout } from '../components/General'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const OrderConfirmation = () => {
  const session = useSession()

  return (
    <Layout width='full'>
      <div className='mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-8 py-16'>
        <div className='flex items-center pb-4 sm:space-x-4'>
          <h1>Thank you for your order 🎉</h1>
          <span className='hidden rounded-md bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-600 hover:text-amber-500 sm:block'>
            Current status: Pending
          </span>
        </div>
        <hr />
        <p className='pt-2 text-lg'>
          We&#39;ve received your order and will send you an email with your tracking number once
          your order has shipped. Currently, your order is still pending and will be processed soon.
          We&#39;ll notify you once your order has been recognized.
        </p>
        {session.status === 'authenticated' && (
          <Link href='/account' className='pt-2 font-semibold text-amber-500 hover:text-amber-600'>
            Click here to view your orders
          </Link>
        )}
      </div>
    </Layout>
  )
}

export default OrderConfirmation
