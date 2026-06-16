import { FetchRequest } from '../api/fetch'

export function useRefreshAccess() {
	const refreshAccess = async () => {
		const token = localStorage.getItem('token')

		const res = await FetchRequest['refresh'](token)

		const answer = await res.json()

		if (res.ok && answer.accessToken) {
			return answer.accessToken
		}
		console.error(answer.message)
		return
	}

	return refreshAccess
}
