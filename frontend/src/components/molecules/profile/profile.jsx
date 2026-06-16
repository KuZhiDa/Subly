import { useEffect } from 'react'
import { useGetUser } from '../../../use/useGetUser'
import './profile.css'
import {
	Routes,
	useNavigate,
	useParams,
	useSearchParams,
	Route,
} from 'react-router-dom'
import Subscriptions from '../../organisms/subscriptions/subscription'

const Profile = () => {
	const navigate = useNavigate()
	const { id } = useParams()

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			localStorage.removeItem('token')
			navigate('/login')
			return
		}
	}, [])

	return (
		<>
			<Routes>
				<Route path='/' />
				<Route path='/subscriptions' element={<Subscriptions />} />
				<Route path='/analytic' />
				<Route path='/history' />
			</Routes>
		</>
	)
}
export default Profile
