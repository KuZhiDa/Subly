import { useState } from 'react'
import './navigation.css'
import { Link, Router } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
const Navigation = () => {
	const location = useLocation()
	return (
		<>
			<ul className='list'>
				{location.pathname !== '/login' && (
					<li>
						<Link className='road' to='/login'>
							Авторизация
						</Link>
					</li>
				)}
				{location.pathname !== '/register' && (
					<li>
						<Link className='road' to='/register'>
							Регистрация
						</Link>
					</li>
				)}
			</ul>
		</>
	)
}
export default Navigation
