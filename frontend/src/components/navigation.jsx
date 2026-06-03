import '../styles/components/navigation.css'

const Navigation = props => {
	let { page } = props
	return (
		<>
			<ul className='list'>
				{page !== 'login' && (
					<li>
						<a className='road' href='login'>
							Авторизация
						</a>
					</li>
				)}
				{page !== 'register' && (
					<li>
						<a className='road' href='register'>
							Регистрация
						</a>
					</li>
				)}
			</ul>
		</>
	)
}
export default Navigation
