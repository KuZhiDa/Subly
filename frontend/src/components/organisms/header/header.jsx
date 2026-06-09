import Navigation from '../../molecules/navigation/navigation'
import './header.css'
import Brand from '../../molecules/brand/brand'
import { Routes, Route } from 'react-router-dom'
import Li from '../../atoms/li/li'
import Menu from '../../molecules/menu/menu'

const Header = () => {
	return (
		<header>
			<Brand />
			<Routes>
				<Route element={<Navigation />}>
					<Route
						path='/'
						element={
							<>
								<Li purpose='/login'>Авторизация</Li>
								<Li purpose='/register'>Регистрация</Li>
							</>
						}
					></Route>
					<Route
						path='/login'
						element={<Li purpose='/register'>Регистрация</Li>}
					></Route>
					<Route
						path='/register'
						element={<Li purpose='/login'>Авторизация</Li>}
					></Route>
				</Route>
				<Route path='/user/*' element={<Menu />} />
			</Routes>
		</header>
	)
}
export default Header
