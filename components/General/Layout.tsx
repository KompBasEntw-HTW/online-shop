import { ReactNode } from 'react'
import clsx from 'clsx'
import Header from './Header'
import Footer from './Footer'

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
  const mainContainerStyles = clsx('bg-sg-50', className)

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
