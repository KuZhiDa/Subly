import './form.css'
import Input from '../../atoms/input/input'
import Button from '../../atoms/button/button'
import google from '../../../assets/Google__G__logo.svg.png'
import { useLocation } from 'react-router-dom'

const Form = () => {
	const location = useLocation()

	const requestAuth = async body => {
		const res = await fetch(
			location.pathname === '/register'
				? 'http://localhost:5000/api/auth/register'
				: 'http://localhost:5000/api/auth/login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			},
		)
		if (!res.ok) {
			const message = (await res.json()).message
			alert(Array.isArray(message) ? message[0] : message)
		}
		if (res.ok) {
			alert(
				`Успешная ${location.pathname === '/login' ? 'авторизация' : 'регистрация'}!`,
			)
		}
	}

	const authGoogle = async () => {
		window.location.href = 'http://localhost:5000/api/auth/google'
	}

	const onSubmit = event => {
		event.preventDefault()
		const target = event.target
		const body = JSON.stringify({
			email: target.login.value,
			password: target.password.value,
			is_2fa_auth: target.twoFa?.checked,
		})
		requestAuth(body)
	}

	return (
		<>
			<form className='container-form' onSubmit={onSubmit}>
				<h2 className='title-form'>
					{location.pathname === '/register' ? 'Регистрация' : 'Авторизация'}
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

					{location.pathname === '/register' && (
						<Input
							id='twoFa'
							name='twoFa'
							type='checkbox'
							classContainer='container-checkbox-field'
						>
							Двойная защита
						</Input>
					)}
				</div>
				<div className='buttons'>
					<Button type='submit' classButton='login-register-button'>
						{location.pathname === '/register'
							? 'Зарегистрироваться'
							: 'Авторизоваться'}
					</Button>
					{location.pathname === '/login' && (
						<>
							<Button
								type='button'
								classButton='login-register-button'
								onClick={authGoogle}
							>
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
