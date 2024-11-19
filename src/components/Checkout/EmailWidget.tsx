import { TextField } from '../General/FormFields'

const EmailWidget = ({
	value,
	onChangeEmail
}: {
	value: string
	onChangeEmail: (email: string) => void
}) => {
	return (
		<div>
			<h2 className='text-lg font-medium text-gray-900'>Contact information</h2>

			<TextField
				type='email'
				id='email-address'
				name='email-address'
				autoComplete='email'
				label='Email address'
				placeholder='hello@gmail.com'
				className='mt-4'
				value={value}
				onChange={(e) => onChangeEmail(e.target.value)}
			/>
		</div>
	)
}

export default EmailWidget
