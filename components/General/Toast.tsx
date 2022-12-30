import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useEffect } from 'react'

type ToastProps = {
  title: string
  description?: string
  onFinished: () => void
}

const Toast: React.FC<ToastProps> = ({ title, description, onFinished }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFinished()
    }, 3000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onFinished])

  return (
    <div
      className={`fixed bottom-8 right-8 m-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 shadow-lg`}>
      <CheckCircleIcon className='h-8 w-8 text-amber-600' />
      <div>
        <h5 className='font-lora font-bold'>{title}</h5>
        {description && <p className='mb-0 pt-0.5 text-sm text-gray-500'>{description}</p>}
      </div>
    </div>
  )
}

export default Toast
