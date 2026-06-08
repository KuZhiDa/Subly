import Form from '../form/form'
import './table-info.css'
import { useLocation } from 'react-router-dom'

const TableInfo = props => {
	const location = useLocation()
	return (
		<>
			<div className='container-table'>
				{location.pathname === '/main' ? (
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
						<Form />
					</>
				)}
			</div>
			{location.pathname === '/main' && (
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
