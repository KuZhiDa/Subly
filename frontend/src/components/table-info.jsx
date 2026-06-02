const TableInfo = props => {
	const { currentPage } = props
	let content
	if (currentPage === 'main') {
		content = (
			<>
				<p className='text-bold'>
					Это веб-приложение предназначено для вашей финансовой безопасности.
				</p>
				<p className='text-normal'>
					После регистрации у каждого пользователя есть шанс стать финансово
					грамотным и спасти свои денежные средства вовремя.
				</p>
			</>
		)
	} else {
		content = (
			<>
				<div className='container-forms'>
					<div className='container-label'>
						<label htmlFor='login'>Логин:</label>
						<input id='login' name='login' type='email'></input>
					</div>

					<div className='container-label'>
						<label htmlFor='password'>Пароль:</label>
						<input id='password' name='password' type='password'></input>
					</div>

					<button onClick={() => alert('я ТУТ')}>
						{currentPage === 'register'
							? 'Зарегистрироваться'
							: 'Авторизоваться'}
					</button>
				</div>
			</>
		)
	}

	return (
		<>
			<div className='container-table'>
				{content}
				{}
			</div>
			{currentPage === 'main' && (
				<div className='container-text-under-table'>
					<p className='text-under-table'>
						<spain className='text-under-table-register'>Регистрируйся,</spain>{' '}
						не пожалеешь
					</p>
				</div>
			)}
		</>
	)
}
export default TableInfo
