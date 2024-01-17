import { useSession, signOut, getCsrfToken } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Layout } from '../components/General'
import { EmptyStatePlaceholder } from '../components/Shop'
import { useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { Order, OrderWithProductsData } from '../types'
import SingleOrder from '../components/Account/SingleOrder'
import useProductsData from '../hooks/useProductsData'

const getOrders = async (session: Session | null) =>
  fetch('/api/checkout-service/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + session?.accessToken
    }
  }).then(res => res.json())

const Account = () => {
  const session = useSession()
  const [csrfToken, setCsrfToken] = useState('')
  const { data: orders, refetch } = useQuery<Order[]>({
    queryKey: ['orders', session],
    queryFn: () => getOrders(session.data)
  })
  const { products } = useProductsData()

  useEffect(() => {
    const getAuth = async () => {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')
    }
    getAuth()
    refetch()
  }, [refetch])

  useEffect(() => {
    refetch()
  }, [session, refetch])

  let transformedOrders: OrderWithProductsData[] | undefined

  if (orders && products) {
    transformedOrders = orders?.map(order => {
      const associatedProducts = order.orderItems?.map(orderItem => {
        const associatedProduct = products?.find(product => product.id === orderItem.item.productId)
        const selectedBagSize = associatedProduct?.coffeeBagSizes?.find(
          bagSize =>
            orderItem.item.productId === associatedProduct.id &&
            bagSize.bagSize.id === orderItem.item.bagSizeId
        )
        return {
          id: orderItem.id,
          quantity: orderItem.quantity,
          ...associatedProduct,
          selectedBagSize: selectedBagSize
        }
      })

      return {
        ...order,
        orderItems: associatedProducts
      }
    }) as OrderWithProductsData[]
  }

  if (session.status === 'authenticated') {
    return (
      <Layout>
        <section className='py-12'>
          <div className='flex content-center justify-between'>
            <h1>Account</h1>
            <button
              onClick={() => signOut()}
              className='rounded-md border border-amber-100 bg-amber-100 px-4 py-1 font-semibold text-amber-600 hover:border-amber-600'>
              Sign out
            </button>
          </div>
          <div className='flex flex-col pt-4'>
            <span className='text-lg font-semibold'>{session?.data.user?.name}</span>
            <span className='text-sm text-gray-500'>{session?.data?.user?.email}</span>
          </div>
        </section>
        <section className='py-12'>
          <h2>Your Orders</h2>
          {orders?.length === 0 ? (
            <EmptyStatePlaceholder
              content={{
                title: 'No orders found',
                description: 'You have not placed any orders yet.'
              }}
              className='mt-4'
            />
          ) : (
            <div className='flex flex-col gap-y-2 pt-4'>
              {transformedOrders?.map((order, idx) => {
                if (order) return <SingleOrder order={order} key={idx} />
              })}
            </div>
          )}
        </section>
      </Layout>
    )
  }

  if (session.status === 'loading') {
    return (
      <Layout>
        <div className='flex min-h-[85vh] items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-b-2 border-amber-500'></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className='flex h-[70vh] flex-col items-center justify-center py-12 text-center'>
        <h1>You&#39;re not currently logged in</h1>
        <p className='pt-2 text-lg'>
          You need to be signed in to view this page. You can sign in by clicking the button below.
        </p>
        <form action='/api/auth/signin/keycloak' method='POST' className='pt-4'>
          <input type='hidden' name='csrfToken' value={csrfToken} />
          <input type='hidden' name='callbackUrl' value='/account' />
          <button
            type='submit'
            className='rounded-md border border-amber-100 bg-amber-100 px-4 py-1 font-semibold text-amber-600 hover:border-amber-600'>
            <span>Sign in</span>
          </button>
        </form>
      </section>
    </Layout>
  )
}

export default Account
