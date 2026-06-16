import './input.css'

const Input = props => {
	const { id, name, type, children, classContainer, classLabel, classInput } =
		props
	return (
		<div className={classContainer}>
			<input className={classInput} id={id} name={name} type={type}></input>
			<label className={classLabel} htmlFor={id}>
				{children}
			</label>
		</div>
	)
}
export default Input
