import clsx from 'clsx'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { ReactNode, ComponentProps } from 'react'

const formClasses =
  'block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm mt-1'

const Label = ({
  id,
  children,
  className,
  ...props
}: {
  id: string
  children: ReactNode
  className?: string
} & ComponentProps<'label'>) => {
  return (
    <label
      htmlFor={id}
      className={clsx('mb-2 text-sm font-medium text-gray-700', className)}
      {...props}>
      {children}
    </label>
  )
}

const ErrorMessage = ({ message, className }: { message: string; className?: string }) => {
  const styles = clsx('inline-flex gap-x-1 pt-1 text-xs text-red-500', className)

  return (
    <p className={styles}>
      <InformationCircleIcon className='h-4 w-4' />
      {message}
    </p>
  )
}

export const TextField = ({
  id,
  label,
  type = 'text',
  value,
  className = '',
  required = true,
  errorMsg,
  ...props
}: {
  id: string
  label?: string
  type?: string
  value: string
  className?: string
  required?: boolean
  errorMsg?: string
} & ComponentProps<'input'>) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      {required && (
        <span className="text-sm font-medium text-slate-700 after:ml-0.5 after:text-amber-500 after:content-['*']" />
      )}
      <input id={id} type={type} {...props} className={formClasses} required={required} />
      {errorMsg && value?.length > 1 && <ErrorMessage message={errorMsg} />}
    </div>
  )
}

export const SelectField = ({
  options,
  id,
  label,
  className = '',
  required = true,
  errorMsg,
  ...props
}: {
  options: string[] | readonly string[]
  id: string
  label?: string
  className?: string
  required?: boolean
  errorMsg?: string
} & ComponentProps<'select'>) => {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      {required && (
        <span className="text-sm font-medium text-slate-700 after:ml-0.5 after:text-amber-500 after:content-['*']" />
      )}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorMsg && <ErrorMessage message={errorMsg} />}
    </div>
  )
}

export const CheckboxField = ({
  id,
  label,
  className = 'flex items-center gap-x-2',
  required = true,
  errorMsg,
  ...props
}: {
  id: string
  label?: string
  type?: string
  className?: string
  required?: boolean
  errorMsg?: string
} & ComponentProps<'input'>) => {
  return (
    <div className={className}>
      <input
        id={id}
        type='checkbox'
        {...props}
        className='rounded-md border-zinc-100 checked:text-amber-500 focus:text-amber-500 focus:ring-amber-500'
        required={required}
      />
      {label && (
        <Label id={id} className='mb-0'>
          {label}
        </Label>
      )}
      {required && (
        <span className="text-sm font-medium text-slate-700 after:ml-0.5 after:text-amber-500 after:content-['*']" />
      )}
      {errorMsg && <ErrorMessage message={errorMsg} />}
    </div>
  )
}
