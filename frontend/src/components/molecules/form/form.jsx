import './form.css'
import Input from '../../atoms/input/input'
import Button from '../../atoms/button/button'
import google from '../../../assets/Google__G__logo.svg.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FetchRequest } from '../../../api/fetch'

const Form = props => {
	const { purpose } = props
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			navigate(`/wait?token=${token}`)
		}
	}, [])

	const requestAuth = async body => {
		const res = await (purpose === 'login'
			? FetchRequest['login'](body)
			: FetchRequest['register'](body))
		const answer = await res.json()
		if (!res.ok) {
			alert(Array.isArray(answer.message) ? answer.message[0] : answer.message)
		}
		if (res.ok) {
			purpose === 'register'
				? navigate('/login')
				: navigate(`/wait?token=${answer.accessToken}`)
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
			<form className='container-form' onSubmit={onSubmit} key={purpose}>
				<h2 className='title-form'>
					{purpose === 'register' ? 'Регистрация' : 'Авторизация'}
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
				</div>
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
			</form>
		</>
	)
}
export default Form
