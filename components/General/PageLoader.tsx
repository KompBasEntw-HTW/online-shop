import clsx from 'clsx'

const PageLoader = ({
  color = 'amber',
  spinnerSize = 'h-32 w-32',
  loaderHeight = 'h-screen'
}: {
  color?: string
  spinnerSize?: string
  loaderHeight?: string
}) => {
  const containerStyles = clsx('flex items-center justify-center', loaderHeight)
  const spinnerStyles = clsx(
    'animate-spin rounded-full border-b-2',
    `border-${color}-800`,
    spinnerSize
  )

  return (
    <div className={containerStyles}>
      <div className={spinnerStyles}></div>
    </div>
  )
}

export default PageLoader
