import { ChangeEvent } from 'react'

const Searchbar = ({
	onChange,
	value,
	placeholder = 'Search our products'
}: {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	value: string
	placeholder?: string
}) => {
	return (
		<input
			placeholder={placeholder}
			value={value}
			className='flex-1 rounded-lg border px-4 py-2 text-zinc-500 placeholder:text-zinc-500 focus:border focus:border-zinc-500 focus:outline-hidden'
			onChange={onChange}
			id='product-search'
		/>
	)
}

export default Searchbar
