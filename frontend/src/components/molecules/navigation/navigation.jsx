import { useState } from 'react'
import './navigation.css'
import { Link, Outlet, Router } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import line from '../../../assets/icons8-линии-захвата-48.png'

const Navigation = () => {
	const location = useLocation()
	return (
		<>
			<ul className='list'>
				<Outlet />
			</ul>
		</>
	)
}
export default Navigation
