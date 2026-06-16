import './form.css'

const Form = props => {
	const { children, onSubmit, purpose } = props

	return (
		<>
			<form className='container-form' onSubmit={onSubmit} key={purpose}>
				<h2 className='title-form'>
					{purpose === 'register'
						? 'Регистрация'
						: purpose === 'login'
							? 'Авторизация'
							: 'Двухфакторная аутентификация'}
				</h2>
				{children}
			</form>
		</>
	)
}
export default Form
