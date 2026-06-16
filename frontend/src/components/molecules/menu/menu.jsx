import { useEffect, useState } from 'react'
import line from '../../../assets/icons8-линии-захвата-48.png'
import Button from '../../atoms/button/button'
import './menu.css'
import Navigation from '../navigation/navigation'
import Li from '../../atoms/li/li'
import { FetchRequest } from '../../../api/fetch'
import { useNavigate, useParams } from 'react-router-dom'

const Menu = () => {
	const [isActiveMenu, setIsActiveMenu] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()

	const onClick = async () => {
		const token = localStorage.getItem('token')
		if (!token) {
			navigate('/login')
			return
		}

		const res = await FetchRequest['logout'](token)

		const answer = await res.json()

		if (!res) {
			console.log(answer.message)
		}

		localStorage.removeItem('token')
		navigate('/login')
		return
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
					<Li purpose={`/profile/${id}`}>Профиль</Li>
					<Li purpose={`/profile/${id}/subscriptions`}>Подписки</Li>
					<Li purpose={`/profile/${id}/history`}>История</Li>
					<Li purpose={`/profile/${id}/analytic`}>Аналитика</Li>
					<Li>
						<Button classButton='logout-button' onClick={() => onClick()}>
							Выйти
						</Button>
					</Li>
				</ul>
			</div>
		</>
	)
}
export default Menu
