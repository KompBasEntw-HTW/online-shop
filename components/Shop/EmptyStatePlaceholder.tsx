import { FaceFrownIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

const EmptyStatePlaceholder = ({
  content,
  colors = {
    container: 'bg-amber-50 border-amber-100',
    iconBackground: 'bg-amber-200',
    icon: 'text-amber-600'
  },
  className
}: {
  type?: 'noResults' | 'error'
  content: {
    title: string
    description: string
  }
  colors?: {
    container: string
    iconBackground: string
    icon: string
  }
  className?: string
}) => {
  const containerStyles = clsx(
    'col flex h-96 flex-col place-items-center justify-center rounded-lg border p-12',
    colors?.container,
    className
  )
  const iconBackgroundStyles = clsx(
    'flex h-16 w-16 place-content-center place-items-center rounded-full',
    colors?.iconBackground
  )

  const iconStyles = clsx('place h-12 w-12', colors?.icon)

  return (
    <div className={containerStyles}>
      <div className={iconBackgroundStyles}>
        <FaceFrownIcon className={iconStyles} />
      </div>
      <h2 className='pt-4'>{content.title}</h2>
      <p className='pt-4 text-gray-600'>{content.description}</p>
    </div>
  )
}

export default EmptyStatePlaceholder
