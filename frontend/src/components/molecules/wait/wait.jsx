import { useEffect } from 'react'
import './wait.css'
import { useGetUser } from '../../../use/useGetUser'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Form from '../form/form'
import Input from '../../atoms/input/input'

const Wait = () => {
	const getUser = useGetUser()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const tokenInParams = searchParams.get('token')
		if (tokenInParams) {
			localStorage.setItem('token', tokenInParams)
		}
		const token = localStorage.getItem('token')
		if (!token) {
			navigate('/login')
			return
		}

		getUser()
			.then(data => {
				if (!data) {
					localStorage.removeItem('token')
					navigate('/login')
					return
				}
				if (data.is2FaAuth) {
					navigate(`/2FaAuth/${data.email}`)
					return
				}
				navigate(`/profile/${data.id}`)
				return
			})
			.catch(e => {
				console.error(e)
			})
	}, [])

	return (
		<>
			<div className='container-wait'>
				<h1 className='text-wait'>Немного подождите</h1>
			</div>
		</>
	)
}
export default Wait
