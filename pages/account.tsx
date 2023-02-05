import { useSession, signOut, getCsrfToken } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useEffect } from 'react'
import { Layout } from '../components/General'
import { EmptyStatePlaceholder } from '../components/Shop'
import { useCartContext } from '../context/CartContext'
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

const Account = () => {
  const { data: session, status } = useSession()
  const [csrfToken, setCsrfToken] = useState('')

  const cart = useCartContext()

  const testOrders: Order[] = [
    {
      orderId: '12234783',
      orderDate: new Date('2021-09-01'),
      orderDetails: {
        subtotal: 100,
        shipping: 10,
        tax: 0,
        total: 110
      },
      items: [
        {
          product: {
            coffeeBagSizes: [
              {
                bagSize: {
                  id: 12,
                  name: 'M',
                  volumeDiscount: 0.1,
                  weightInGrams: 500
                },
                quantity: 6
              },
              {
                bagSize: {
                  id: 14,
                  name: 'XL',
                  volumeDiscount: 0.2,
                  weightInGrams: 1000
                },
                quantity: 1
              },
              {
                bagSize: {
                  id: 13,
                  name: 'L',
                  volumeDiscount: 0.15,
                  weightInGrams: 750
                },
                quantity: 5
              },
              {
                bagSize: {
                  id: 11,
                  name: 'S',
                  volumeDiscount: 0,
                  weightInGrams: 250
                },
                quantity: 1
              }
            ],
            description:
              "This signature House Blend was crafted as the hallmark coffee for Irving's original cafe at 71 Irving Place. Classic, rich, smooth flavors are great with milk.",
            flavor: 'Sweet & Smooth',
            flavorNotes: [
              {
                flavorNote: 'Spice',
                id: 8
              },
              {
                flavorNote: 'Nut',
                id: 10
              },
              {
                flavorNote: 'Citrus',
                id: 2
              }
            ],
            id: 35,
            imageUrl:
              'https://res.cloudinary.com/roastcollective/image/upload/h_1000,w_1000,f_auto,fl_progressive:steep,q_auto:good/v1661179176/solidus/nien9l92dj3bis3vbvof.png',
            location: 'New York, NY',
            name: '71 House Blend',
            pricePerKilo: 19.65,
            roastLevel: 6,
            roaster: 'Irving Farm',
            roasterNotes:
              'Our signature House Blend was created as the hallmark coffee for our original cafe at 71 Irving Place. The blend has a chocolate, round, and smooth flavor.'
          },
          quantity: 1,
          size: {
            bagSize: {
              id: 13,
              name: 'L',
              volumeDiscount: 0.15,
              weightInGrams: 750
            },
            quantity: 5
          }
        },
        {
          product: {
            coffeeBagSizes: [
              {
                bagSize: {
                  id: 13,
                  name: 'L',
                  volumeDiscount: 0.15,
                  weightInGrams: 750
                },
                quantity: 5
              },
              {
                bagSize: {
                  id: 12,
                  name: 'M',
                  volumeDiscount: 0.1,
                  weightInGrams: 500
                },
                quantity: 1
              },
              {
                bagSize: {
                  id: 14,
                  name: 'XL',
                  volumeDiscount: 0.2,
                  weightInGrams: 1000
                },
                quantity: 2
              },
              {
                bagSize: {
                  id: 11,
                  name: 'S',
                  volumeDiscount: 0,
                  weightInGrams: 250
                },
                quantity: 1
              }
            ],
            description:
              'Deeply sweet and chocolaty, with a kiss of roastiness pairing beautifully with notes of toasted walnut.',
            flavor: 'Comforting & Rich',
            flavorNotes: [
              {
                flavorNote: 'Spice',
                id: 8
              },
              {
                flavorNote: 'Ripe Fruit',
                id: 3
              },
              {
                flavorNote: 'Brow Sugar',
                id: 4
              },
              {
                flavorNote: 'Milk Chocolate',
                id: 1
              }
            ],
            id: 32,
            imageUrl:
              'https://res.cloudinary.com/roastcollective/image/upload/h_1000,w_1000,f_auto,fl_progressive:steep,q_auto:good/v1660237550/solidus/fdaeef3wch3cnmzqommf.png',
            location: 'Bentonville, AR',
            name: 'Black Bear Blend',
            pricePerKilo: 25.45,
            roastLevel: 7,
            roaster: 'Airship',
            roasterNotes:
              "A lot can be (and has been) said about dark roasted coffee. This is the only coffee we profile by roast color. But we don't just turn coffee dark by roasting it longer. We pay close attention to Black Bear by selecting the best coffee and roasting it carefully so it retains its sweetness. Black Bear is complex, velvety, and roasted darker to bring out a rich body."
          },
          quantity: 2,
          size: {
            bagSize: {
              id: 14,
              name: 'XL',
              volumeDiscount: 0.2,
              weightInGrams: 1000
            },
            quantity: 6
          }
        },
        {
          product: {
            coffeeBagSizes: [
              {
                bagSize: {
                  id: 13,
                  name: 'L',
                  volumeDiscount: 0.15,
                  weightInGrams: 750
                },
                quantity: 3
              },
              {
                bagSize: {
                  id: 11,
                  name: 'S',
                  volumeDiscount: 0,
                  weightInGrams: 250
                },
                quantity: 6
              },
              {
                bagSize: {
                  id: 14,
                  name: 'XL',
                  volumeDiscount: 0.2,
                  weightInGrams: 1000
                },
                quantity: 2
              },
              {
                bagSize: {
                  id: 12,
                  name: 'M',
                  volumeDiscount: 0.1,
                  weightInGrams: 500
                },
                quantity: 0
              }
            ],
            description:
              'With a big, chocolaty body, cozy roasted almond nuttiness and tons of balanced caramel sweetness, this Trade-exclusive cup is just about as comforting as you can get.',
            flavor: 'Comforting & Rich',
            flavorNotes: [
              {
                flavorNote: 'Ripe Fruit',
                id: 3
              },
              {
                flavorNote: 'Brow Sugar',
                id: 4
              },
              {
                flavorNote: 'Roastiness',
                id: 5
              },
              {
                flavorNote: 'Milk Chocolate',
                id: 1
              }
            ],
            id: 26,
            imageUrl:
              'https://res.cloudinary.com/roastcollective/image/upload/h_1000,w_1000,f_auto,fl_progressive:steep,q_auto:good/v1660249589/solidus/rkbqu9yice0f4nuuis7x.png',
            location: 'Denver, CO',
            name: 'Bom Senso',
            pricePerKilo: 18.4,
            roastLevel: 8,
            roaster: 'Huckleberry',
            roasterNotes:
              'Bom Senso is a Trade-exclusive, traditional coffee. We source straightforward coffees from Latin America, and roast them a bit darker (for Huckleberry, at least) to create a big, bold cup for the dark roast lovers out there.'
          },
          quantity: 1,
          size: {
            bagSize: {
              id: 13,
              name: 'L',
              volumeDiscount: 0.15,
              weightInGrams: 750
            },
            quantity: 5
          }
        },
        {
          product: {
            coffeeBagSizes: [
              {
                bagSize: {
                  id: 12,
                  name: 'M',
                  volumeDiscount: 0.1,
                  weightInGrams: 500
                },
                quantity: 3
              },
              {
                bagSize: {
                  id: 13,
                  name: 'L',
                  volumeDiscount: 0.15,
                  weightInGrams: 750
                },
                quantity: 2
              },
              {
                bagSize: {
                  id: 14,
                  name: 'XL',
                  volumeDiscount: 0.2,
                  weightInGrams: 1000
                },
                quantity: 0
              },
              {
                bagSize: {
                  id: 11,
                  name: 'S',
                  volumeDiscount: 0,
                  weightInGrams: 250
                },
                quantity: 7
              }
            ],
            description:
              "A deep black cherry sweetness peeks through this coffee's pronounced dark chocolate and cinnamon notes.",
            flavor: 'Sweet & Smooth',
            flavorNotes: [
              {
                flavorNote: 'Roastiness',
                id: 5
              }
            ],
            id: 25,
            imageUrl:
              'https://res.cloudinary.com/roastcollective/image/upload/h_1000,w_1000,f_auto,fl_progressive:steep,q_auto:good/v1663185414/solidus/xw8crsq1xams1qcgds4b.png',
            location: 'Nashville, TN',
            name: 'Canopy',
            pricePerKilo: 25.85,
            roastLevel: 6,
            roaster: 'Common Voice',
            roasterNotes:
              'Rise above it all with this rich, dark roast with a strong,complex flavor from Latin America. Deliciously aromatic, ahint of Chocolate, a touch of Spice, and notes of Caramelwill lift your spirits when you need to go bold.'
          },
          quantity: 2,
          size: {
            bagSize: {
              id: 13,
              name: 'L',
              volumeDiscount: 0.15,
              weightInGrams: 750
            },
            quantity: 5
          }
        },
        {
          product: {
            coffeeBagSizes: [
              {
                bagSize: {
                  id: 12,
                  name: 'M',
                  volumeDiscount: 0.1,
                  weightInGrams: 500
                },
                quantity: 6
              },
              {
                bagSize: {
                  id: 14,
                  name: 'XL',
                  volumeDiscount: 0.2,
                  weightInGrams: 1000
                },
                quantity: 1
              },
              {
                bagSize: {
                  id: 13,
                  name: 'L',
                  volumeDiscount: 0.15,
                  weightInGrams: 750
                },
                quantity: 5
              },
              {
                bagSize: {
                  id: 11,
                  name: 'S',
                  volumeDiscount: 0,
                  weightInGrams: 250
                },
                quantity: 1
              }
            ],
            description:
              "This signature House Blend was crafted as the hallmark coffee for Irving's original cafe at 71 Irving Place. Classic, rich, smooth flavors are great with milk.",
            flavor: 'Sweet & Smooth',
            flavorNotes: [
              {
                flavorNote: 'Spice',
                id: 8
              },
              {
                flavorNote: 'Nut',
                id: 10
              },
              {
                flavorNote: 'Citrus',
                id: 2
              }
            ],
            id: 35,
            imageUrl:
              'https://res.cloudinary.com/roastcollective/image/upload/h_1000,w_1000,f_auto,fl_progressive:steep,q_auto:good/v1661179176/solidus/nien9l92dj3bis3vbvof.png',
            location: 'New York, NY',
            name: '71 House Blend',
            pricePerKilo: 19.65,
            roastLevel: 6,
            roaster: 'Irving Farm',
            roasterNotes:
              'Our signature House Blend was created as the hallmark coffee for our original cafe at 71 Irving Place. The blend has a chocolate, round, and smooth flavor.'
          },
          quantity: 4,
          size: {
            bagSize: {
              id: 12,
              name: 'M',
              volumeDiscount: 0.1,
              weightInGrams: 500
            },
            quantity: 5
          }
        }
      ]
    }
  ]

  console.log(cart.cart)

  const [orders, setOrders] = useState(testOrders)

  console.log(orders)

  useEffect(() => {
    async function getAuth() {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')

      if (!session) return
    }
    getAuth()

    if (status === 'authenticated') {
      fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        }
      })
        .then(response => response.json())
        .then(data => {
          setOrders(data)
        })
    }
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
              {orders.map(order => (
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
                    {order.items.map(item => (
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
