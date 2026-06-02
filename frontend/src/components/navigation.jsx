import '../styles/components/navigation.css'

const Navigation = props => {
	const { page } = props
	return (
		<>
			<ul className='list'>
				{page !== 'login' && (
					<li>
						<a className='road' href='/login'>
							Авторизация
						</a>
					</li>
				)}
				{page !== 'register' && (
					<li>
						<a className='road' href=''>
							Регистрация
						</a>
					</li>
				)}
			</ul>
		</>
	)
}
export default Navigation
