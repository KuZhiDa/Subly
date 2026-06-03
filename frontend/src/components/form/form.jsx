import '../../styles/components/form/form.css'
import Input from '../input'
import Button from '../button'
import google from '../../assets/Google__G__logo.svg.png'

const Form = props => {
	const { currentPage } = props
	return (
		<>
			<form className='container-form'>
				<h2 className='title-form'>
					{currentPage === 'register' ? 'Регистрация' : 'Авторизация'}
				</h2>
				<div className='labels'>
					<Input
						id='login'
						name='login'
						type='email'
						classContainer='container-string-field'
						classLabel='label-string-field'
						classInput='input-string-field'
					>
						Логин
					</Input>
					<Input
						id='password'
						name='password'
						type='password'
						classContainer='container-string-field'
						classLabel='label-string-field'
						classInput='input-string-field'
					>
						Пароль
					</Input>

					{currentPage === 'register' && (
						<Input
							id='2fa'
							name='2fa'
							type='checkbox'
							classContainer='container-checkbox-field'
						>
							Двойная защита
						</Input>
					)}
				</div>
				<div className='buttons'>
					<Button type='submit' classButton='login-register-button'>
						{currentPage === 'register'
							? 'Зарегистрироваться'
							: 'Авторизоваться'}
					</Button>
					{currentPage === 'login' && (
						<>
							<Button type='submit' classButton='login-register-button'>
								<img className='google-logo' src={google} />
								Продолжить с Google
							</Button>
						</>
					)}
				</div>
			</form>
		</>
	)
}
export default Form
