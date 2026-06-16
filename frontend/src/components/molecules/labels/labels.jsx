import './labels.css'

const Labels = props => {
	const { children } = props
	return (
		<>
			<div className='labels'>{children}</div>
		</>
	)
}

export default Labels
