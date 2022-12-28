import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'
const Account = () => {
  const { data: session } = useSession()
  useEffect(() => {
    async function getMe() {
      if (!session) return
      const res = await fetch('/api/product-service/users/me', {
        headers: {
          // Authorization: `Bearer ${Buffer.from(JSON.stringify(session.jwt)).toString('base64')}`
          Authorization: `Bearer ${session.accessToken}`
        }
      })
      if (res.ok) {
        const user = await res.json()
        console.log(user)
      }
    }
    getMe()
  }, [session])
  if (session) {
    return (
      <>
        {' '}
        Signed in as {session.user?.email} <br />{' '}
        <button onClick={() => signOut()}>Sign out</button>{' '}
        <code>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </code>
      </>
    )
  }
  return (
    <>
      {' '}
      Not signed in <br /> <button onClick={() => signIn()}>Sign in</button>{' '}
    </>
  )
}

export default Account
