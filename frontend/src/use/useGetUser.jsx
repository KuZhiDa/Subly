import { FetchRequest } from '../api/fetch'
import { useRefreshAccess } from './useRefreshAccess'

export function useGetUser() {
	const refreshAccess = useRefreshAccess()
	const getUser = async () => {
		const token = localStorage.getItem('token')

		const res = await FetchRequest['getUser'](token)

		const answer = await res.json()

		if (res.ok) {
			return answer
		}
		if (answer.message === 'Unauthorized') {
			const newToken = await refreshAccess(token)
			if (newToken) {
				localStorage.setItem('token', newToken)
				const retryRes = await FetchRequest['getUser'](newToken)
				const retryAnswer = await retryRes.json()
				if (retryRes.ok) {
					return retryAnswer
				}
				console.error(retryAnswer.message)
			}
			return
		}
		console.error(answer.message)
		return
	}
	return getUser
}
