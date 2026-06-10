import { useEffect, useState } from 'react'
import line from '../../../assets/icons8-линии-захвата-48.png'
import Button from '../../atoms/button/button'
import './menu.css'
import Navigation from '../navigation/navigation'
import Li from '../../atoms/li/li'
import arrow from '../../../assets/icon-icons.png'
import { FetchRequest } from '../../../api/fetch'
import { useNavigate } from 'react-router-dom'

const Menu = () => {
	const [isActiveMenu, setIsActiveMenu] = useState(false)
	const [token, setToken] = useState()
	const navigate = useNavigate()
	useEffect(() => {
		setToken(localStorage.getItem('token'))
		if (!token) {
			navigate('/login')
		}
		setToken(token)
	}, [])

	const onClick = async token => {
		const res = await FetchRequest['logout'](token)

		const answer = await res.json()

		if (res.ok) {
			return answer
		}
		if (answer.message === 'Unauthorized') {
			await updateAccess(token)
		}
	}

	const updateAccess = async token => {
		const res = await FetchRequest['refresh'](token)

		const answer = await res.json()
		if (res.ok) {
			checkUserAndRedirect(answer.accessToken)
		}
		localStorage.removeItem('token')
	}

	return (
		<>
			<div className='container-menu'>
				<Button
					classButton='menu-button'
					type='button'
					onClick={() => {
						setIsActiveMenu(!isActiveMenu)
					}}
				>
					<img src={line} />
				</Button>
				<ul className={`menu ${isActiveMenu ? 'active' : ''}`}>
					<Li purpose='/user/:id'>Профиль</Li>
					<Li purpose='/user/:id/subscription'>Подписки</Li>
					<Li purpose='/user/:id/history'>История</Li>
					<Li purpose='/user/:id/analytic'>Аналитика</Li>
					<Li>
						<Button classButton='logout-button' onClick={() => onClick(token)}>
							Выйти
						</Button>
					</Li>
				</ul>
			</div>
		</>
	)
}
export default Menu
