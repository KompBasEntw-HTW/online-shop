import { RadioGroup } from '@headlessui/react'
import { ShippingMethodType } from '../../types'
import clsx from 'clsx'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const ShippingMethodWidget = ({
  shippingMethods,
  selectedMethod,
  setSelected,
  hasDiscountedShippingCost
}: {
  shippingMethods: ShippingMethodType[]
  selectedMethod: ShippingMethodType
  setSelected: (method: ShippingMethodType) => void
  hasDiscountedShippingCost: boolean
}) => {
  return (
    <div className='mt-10 border-t border-gray-200 pt-10'>
      <RadioGroup value={selectedMethod} onChange={setSelected}>
        <RadioGroup.Label className='font-lora text-lg font-medium text-gray-900'>
          Delivery method
        </RadioGroup.Label>

        <div className='mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4'>
          {shippingMethods.map(shippingMethod => (
            <RadioGroup.Option
              key={shippingMethod.id}
              value={shippingMethod}
              className={({ checked, active }) =>
                clsx(
                  checked ? 'border-transparent bg-amber-50' : 'border-gray-300',
                  active ? 'bg-amber-50 ring-2 ring-amber-500' : '',
                  'relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none'
                )
              }>
              {({ checked, active }) => (
                <>
                  <span className='flex flex-1'>
                    <span className='flex flex-col'>
                      <RadioGroup.Label
                        as='span'
                        className='block text-sm font-medium text-gray-900'>
                        {shippingMethod.title}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as='span'
                        className='mt-1 flex items-center text-sm text-gray-500'>
                        {shippingMethod.turnaround}
                      </RadioGroup.Description>
                      <RadioGroup.Description
                        as='span'
                        className='mt-6 text-sm font-medium text-gray-900'>
                        {hasDiscountedShippingCost
                          ? `$${shippingMethod.reducedPrice} USD`
                          : `$${shippingMethod.basePrice} USD`}
                      </RadioGroup.Description>
                    </span>
                  </span>
                  {checked ? (
                    <CheckCircleIcon className='h-6 w-6 text-amber-600' aria-hidden='true' />
                  ) : null}
                  <span
                    className={clsx(
                      active ? 'border' : 'border-2',
                      checked ? 'border-amber-500' : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-lg'
                    )}
                    aria-hidden='true'
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export default ShippingMethodWidget
