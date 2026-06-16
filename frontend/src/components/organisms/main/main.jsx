import './main.css'
import TableInfo from '../../molecules/table-info/table-info'
import { Route, Routes } from 'react-router-dom'
import Auth from '../auth/auth'
import TextInTable from '../../atoms/text/table/in/in'
import Profile from '../../molecules/profile/profile'
import Wait from '../../molecules/wait/wait'
import TwoFaAuth from '../2FaAuth/2FaAuth'

const Main = () => {
	return (
		<>
			<main>
				<Routes>
					<Route element={<TableInfo />}>
						<Route
							path='/'
							element={
								<>
									<TextInTable />
								</>
							}
						/>
						<Route path='/login' element={<Auth purpose='login' />} />
						<Route path='/register' element={<Auth purpose='register' />} />
						<Route path='/2FaAuth/:email' element={<TwoFaAuth />} />
					</Route>
					<Route path='/profile/:id/*' element={<Profile />} />
				</Routes>
			</main>
		</>
	)
}
export default Main
