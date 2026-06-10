import './main.css'
import TableInfo from '../../molecules/table-info/table-info'
import { Route, Routes } from 'react-router-dom'
import Form from '../../molecules/form/form'
import TextInTable from '../../atoms/text/table/in/in'
import Profile from '../../molecules/profile/profile'

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
						<Route path='/login' element={<Form purpose='login' />} />
						<Route path='/register' element={<Form purpose='register' />} />
					</Route>
					<Route path='/user/:id' element={<Profile />} />
				</Routes>
			</main>
		</>
	)
}
export default Main
