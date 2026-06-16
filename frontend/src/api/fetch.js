const RequestOnServer = (
	endpoint,
	method,
	body = {},
	headers = {},
	credentials = false,
) => {
	let params = {}
	const string = JSON.stringify(body)
	if (string !== '{}') {
		params.body = string
	}
	if (credentials) {
		params.credentials = 'include'
	}
	return fetch(import.meta.env.VITE_SERVER + endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		...params,
	})
}

export const FetchRequest = {
	login: body => RequestOnServer('/auth/login', 'POST', body, {}, true),
	refresh: token =>
		RequestOnServer(
			'/auth/refresh',
			'PUT',
			{},
			{ Authorization: `Bearer ${token}` },
			true,
		),
	register: body => RequestOnServer('/auth/register', 'POST', body),
	logout: token =>
		RequestOnServer(
			'/auth/logout',
			'DELETE',
			{},
			{ Authorization: `Bearer ${token}` },
			true,
		),
	getUser: token =>
		RequestOnServer('/user', 'GET', {}, { Authorization: `Bearer ${token}` }),
}
