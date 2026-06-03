import '../styles/components/button.css'

const Button = props => {
	const { children, type, classButton } = props
	return (
		<>
			<button className={classButton} onClick={() => {}} type={type}>
				{children}
			</button>
		</>
	)
}
export default Button
