import { useState } from 'react'
import line from '../../../assets/icons8-линии-захвата-48.png'
import Button from '../../atoms/button/button'
import './menu.css'
import Navigation from '../navigation/navigation'
import Li from '../../atoms/li/li'
import arrow from '../../../assets/icon-icons.png'

const Menu = () => {
	const [isActiveMenu, setIsActiveMenu] = useState(false)
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
					<Li purpose='/user/:'>Профиль</Li>
					<Li purpose='/user/:/subscription'>Подписки</Li>
					<Li purpose='/user/:/history'>История</Li>
					<Li purpose='/user/:/analytic'>Аналитика</Li>
					<Li>
						<Button
							classButton='logout-button'
							onClick={() => {
								alert('Я вышел')
							}}
						>
							Выйти
						</Button>
					</Li>
				</ul>
			</div>
		</>
	)
}
export default Menu
