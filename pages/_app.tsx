import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { CartContextProvider } from '../context/CartContext'
import { CurrentOrderContextProvider } from '../context/CurrentOrderContext'

const queryClient = new QueryClient()

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session} refetchOnWindowFocus={true} refetchInterval={60 * 10}>
        <CartContextProvider>
          <CurrentOrderContextProvider>
            <Component {...pageProps} />
          </CurrentOrderContextProvider>
        </CartContextProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default App
