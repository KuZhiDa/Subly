import './button.css'

const Button = props => {
	const { children, type, classButton, onClick } = props
	return (
		<>
			<button className={classButton} type={type} onClick={onClick}>
				{children}
			</button>
		</>
	)
}
export default Button
