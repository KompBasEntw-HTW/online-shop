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
  const mainContainerStyles = clsx(`${width === 'restricted' ? 'px-4' : ''}`, 'bg-sg-50', className)

  const layoutContainerStyles = clsx(`${width === 'restricted' ? 'max-w-7xl' : ''}`, 'mx-auto')

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
