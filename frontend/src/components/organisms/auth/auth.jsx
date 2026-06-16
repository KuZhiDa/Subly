import Input from '../../atoms/input/input'
import Button from '../../atoms/button/button'
import google from '../../../assets/Google__G__logo.svg.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FetchRequest } from '../../../api/fetch'
import Form from '../../molecules/form/form'
import './auth.css'
import Labels from '../../molecules/labels/labels'

const Auth = props => {
	const { purpose } = props
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			navigate('/wait')
		}
	}, [])

	const requestAuth = async body => {
		try {
			const res = await (purpose === 'login'
				? FetchRequest['login'](body)
				: FetchRequest['register'](body))

			const answer = await res.json()

			if (!res.ok) {
				alert(
					Array.isArray(answer.message) ? answer.message[0] : answer.message,
				)
				return
			}

			if (res.ok) {
				if (purpose === 'register') {
					navigate('/login')
				}

				if (purpose === 'login') {
					localStorage.setItem('token', answer.accessToken)
					navigate('/wait')
				}
			}
		} catch (error) {
			console.error('Ошибка при запросе авторизации:', error)
		}
	}

	const authGoogle = async () => {
		window.location.href = 'http://localhost:5000/api/auth/google'
	}

	const onSubmit = event => {
		event.preventDefault()
		const target = event.target
		requestAuth({
			email: target.login.value,
			password: target.password.value,
			is_2fa_auth: target.twoFa?.checked,
		})
	}

	return (
		<>
			<Form purpose={purpose} onSubmit={onSubmit}>
				<Labels>
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

					{purpose === 'register' && (
						<Input
							id='twoFa'
							name='twoFa'
							type='checkbox'
							classContainer='container-checkbox-field'
						>
							Двойная защита
						</Input>
					)}
				</Labels>
				<div className='buttons'>
					<Button type='submit' classButton='login-register-button'>
						{purpose === 'register' ? 'Зарегистрироваться' : 'Авторизоваться'}
					</Button>
					{purpose === 'login' && (
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
			</Form>
		</>
	)
}
export default Auth
