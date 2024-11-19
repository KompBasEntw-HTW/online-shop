const DescriptionListItem = ({
	descriptionTerm,
	descriptionDetails
}: {
	descriptionTerm: string
	descriptionDetails: string
}) => {
	return (
		<div className='flex items-center justify-between'>
			<dt className='text-sm'>{descriptionTerm}</dt>
			<dd className='text-sm font-medium text-gray-900'>{descriptionDetails}</dd>
		</div>
	)
}

export default DescriptionListItem
