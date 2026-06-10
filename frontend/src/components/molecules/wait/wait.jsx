import { useNavigate } from 'react-router-dom'
import './wait.css'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { FetchRequest } from '../../../api/fetch'
import { useGetUser } from '../../../use/useGetUser'

const Wait = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const getUser = useGetUser()

	useEffect(() => {
		const handleAuth = async () => {
			const token = searchParams.get('token')
			localStorage.setItem('token', token)
			const result = await getUser()
			if (result === null) {
				navigate('/login')
				return null
			}
			navigate(`/user/${result.id}`)
		}
		handleAuth()
	}, [searchParams])

	return (
		<>
			<div className='container-wait'>
				<h1 className='text-wait'>Немного подождите</h1>
			</div>
		</>
	)
}
export default Wait
