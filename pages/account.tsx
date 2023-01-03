import { useSession, signOut, getCsrfToken } from 'next-auth/react'
import { useState } from 'react'
import { useEffect } from 'react'
import Layout from '../components/General/Layout'
import EmptyStatePlaceholder from '../components/Shop/EmptyStatePlaceholder'
const Account = () => {
  const { data: session } = useSession()
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    async function getAuth() {
      const crsfToken = await getCsrfToken()
      setCsrfToken(crsfToken || '')

      if (!session) return
    }
    getAuth()
  }, [session])

  if (session) {
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
          <EmptyStatePlaceholder
            content={{
              title: 'No orders found',
              description: 'You have not placed any orders yet.'
            }}
            className='mt-4'
          />
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className='flex h-[70vh] flex-col items-center justify-center py-12'>
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
