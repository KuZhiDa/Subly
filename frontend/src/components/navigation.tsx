import '../style/components/navigation.css'

const Navigation = (data: { page: 'register' | 'login' | 'main' }) => {
	return (
		<>
			<ul className='navigation-ul'>
				{data.page !== 'login' && (
					<li>
						<a className='navigation-a' href=''>
							Авторизация
						</a>
					</li>
				)}
				{data.page !== 'register' && (
					<li>
						<a className='navigation-a' href=''>
							Регистрация
						</a>
					</li>
				)}
			</ul>
		</>
	)
}
export default Navigation
