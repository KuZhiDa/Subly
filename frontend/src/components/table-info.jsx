import Form from './form/form'

const TableInfo = props => {
	const { currentPage } = props

	return (
		<>
			<div className='container-table'>
				{currentPage === 'main' ? (
					<>
						<p className='text-bold'>
							Это веб-приложение предназначено для вашей финансовой
							безопасности.
						</p>
						<p className='text-normal'>
							После регистрации у каждого пользователя есть шанс стать финансово
							грамотным и спасти свои денежные средства вовремя.
						</p>
					</>
				) : (
					<>
						<Form currentPage={currentPage} />
					</>
				)}
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
