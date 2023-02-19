import { useSession, signOut, getCsrfToken } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useEffect } from 'react'
import { Layout } from '../components/General'
import { EmptyStatePlaceholder } from '../components/Shop'
import { CartItem } from '../types'
import { formatDate, addToDate } from '../helpers/utilities'
import Link from 'next/link'

type Order = {
  orderId: string
  orderDate: Date
  orderDetails: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  items: CartItem[]
}

type OrderItem = {
  orderId: string
  canceled: true
  id: 4
  orderDateTime: '2023-02-17T20:02:24.777005Z[GMT]'
  orderItems: []
  subTotal: 0
  userName: 'janosch.hrm@gmail.com'
  valid: false
}

const Account = () => {
  const { data: session, status } = useSession()
  const [csrfToken, setCsrfToken] = useState('')

  const [orders, setOrders] = useState<Order[]>([])

  console.log(orders)

  useEffect(() => {
    const getAuth = async () => {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')

      if (!session) return
    }
    getAuth()

    const fetchOrders = async () => {
      if (status !== 'authenticated') return

      const response = await fetch('/api/checkout-service/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Authorization: 'Bearer ' + session?.accessToken
        }
      })

      if (!response.ok) {
        console.log('Error fetching orders')
        return
      }

      const data = await response.json()

      if (!data) return

      // const productPromises = data.map(async (order: Order) => {})

      setOrders(data)
    }

    fetchOrders()
  }, [session, status, csrfToken])

  if (status === 'authenticated') {
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
            <span className='text-lg font-semibold'>{session?.user?.name}</span>
            <span className='text-sm text-gray-500'>{session?.user?.email}</span>
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
              {orders?.map(order => (
                <div key={order.orderId} className='rounded-md border border-zinc-200 p-8'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-x-4'>
                      <h3 className='text-xl'>Order from {formatDate(order.orderDate)}</h3>
                      <span className='rounded-md bg-amber-50 px-2 py-0.5 text-sm  text-amber-600'>
                        Delivered on {formatDate(addToDate(order.orderDate, 3))}
                      </span>
                    </div>
                    <span className='text-gray-500'>Order id: {order.orderId}</span>
                  </div>

                  <div className='grid grid-cols-3 gap-4 pt-4'>
                    {order?.items?.map(item => (
                      <Link
                        key={item.product.id + item.size.bagSize.id}
                        href={`/products/${item.product.id}`}>
                        <div className='flex gap-x-4 rounded-md border border-zinc-200 bg-zinc-50 hover:cursor-pointer hover:border-zinc-300'>
                          <div className='shrink-0 rounded-xl bg-amber-50'>
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              width={80}
                              height={80}
                            />
                          </div>
                          <div className='flex flex-col justify-center'>
                            <h4 className='text-base'>{item.product.name}</h4>
                            <p className='text-sm text-gray-500'>
                              {item.size.bagSize.weightInGrams}g
                            </p>
                            <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </Layout>
    )
  }

  if (status === 'loading') {
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
