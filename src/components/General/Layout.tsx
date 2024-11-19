import clsx from 'clsx'
import { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

const Layout = ({
	children,
	header = <Header />,
	footer = <Footer />,
	width = 'restricted',
	includeHeader = true,
	includeFooter = true,
	className
}: {
	children: ReactNode
	header?: ReactNode
	footer?: ReactNode
	width?: 'restricted' | 'full'
	includeHeader?: boolean
	includeFooter?: boolean
	className?: string
}) => {
	const mainContainerStyles = clsx('bg-sg-50 isolate', className)

	const layoutContainerStyles = clsx(
		`${width === 'restricted' ? 'max-w-7xl px-4 sm:px-6 lg:px-8' : ''}`,
		'mx-auto'
	)

	return (
		<>
			{includeHeader && header}
			<main className={mainContainerStyles}>
				<div className={layoutContainerStyles}>{children}</div>
			</main>
			{includeFooter && footer}
		</>
	)
}

export default Layout
