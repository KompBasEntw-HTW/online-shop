'use client'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { ChangeEvent, useState } from 'react'
import ReactSlider from 'react-slider'
import { CheckboxFilterType, RangeFilterType } from '../../types'

export const CheckboxFilter = ({
	filter,
	currentValues,
	onFilterChange,
	sectionIdx
}: {
	filter: CheckboxFilterType
	currentValues: string[]
	onFilterChange: (e: ChangeEvent<HTMLInputElement>, filterId: string) => void
	sectionIdx: number
}) => {
	const [showFullList, setShowFullList] = useState(false)

	return (
		<div
			className={clsx(sectionIdx === 0 ? '' : 'pt-6', 'checkbox-filter')}
			id='checkbox-filter-container'>
			<fieldset>
				<legend className='block font-lora text-lg font-bold text-gray-900'>{filter.name}</legend>
				<div className='space-y-2 pt-3'>
					{filter.values.slice(0, showFullList ? undefined : 3).map((option, optionIdx) => (
						<div
							key={option.value}
							className='flex items-center'>
							<input
								id={`${filter.id}-${optionIdx}`}
								name={filter.id}
								defaultValue={option.value}
								checked={currentValues?.includes(option.value) || false}
								type='checkbox'
								className='h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500'
								onChange={(e) => onFilterChange(e, filter.id)}
							/>
							<label
								htmlFor={`${filter.id}-${optionIdx}`}
								className='ml-3 text-sm text-gray-600'>
								{option.name || option.value}
							</label>
						</div>
					))}
				</div>
			</fieldset>
			{!showFullList && (
				<button
					className='inline-flex gap-x-1 pt-4 text-sm text-gray-500'
					onClick={(e) => {
						e.preventDefault()
						setShowFullList(true)
					}}>
					Show more
					<ChevronDownIcon className='h-4 w-4 self-center' />
				</button>
			)}
			{showFullList && (
				<button
					className='inline-flex gap-x-1 pt-4 text-sm text-gray-500'
					onClick={(e) => {
						e.preventDefault()
						setShowFullList(false)
					}}>
					Show less <ChevronUpIcon className='h-4 w-4' />
				</button>
			)}
		</div>
	)
}

export const RangeFilter = ({
	filter,
	onFilterChange
}: {
	filter: RangeFilterType
	onFilterChange: (min: number, max: number, filterId: string) => void
}) => {
	return (
		<div className='pt-6'>
			<fieldset>
				<legend className='block font-lora text-lg font-bold text-gray-900'>{filter.name}</legend>
				<ReactSlider
					className='react-slider-two-thumb'
					thumbClassName='react-slider-thumb'
					trackClassName='react-slider-track'
					defaultValue={[filter.min, filter.max]}
					min={filter.min}
					max={filter.max}
					minDistance={1}
					ariaLabel={['Lower thumb', 'Upper thumb']}
					ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
					renderThumb={(props, state) => <div {...props}>${state.valueNow}</div>}
					onChange={(e) => onFilterChange(e[0], e[1], filter.id)}
				/>
			</fieldset>
		</div>
	)
}
