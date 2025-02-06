import { Footer, Header } from '@/components/General'
import { CartContextProvider } from '@/context/CartContext'
import '@/styles/globals.css'
import '@/styles/leaflet.css'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
	title: 'My Page Title'
}
export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
				<SessionProvider>
					<CartContextProvider>
						<Header />
						<main className='bg-sg-50 isolate'>
							<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
								{children}
							</div>
						</main>
						<Footer />
					</CartContextProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
