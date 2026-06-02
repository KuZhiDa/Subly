import '../styles/components/main.css'

const Main = () => {
	return (
		<>
			<main>
				<div className='container-table'>
					<p className='text-bold'>
						Это веб-приложение предназначено для вашей финансовой безопасности.
					</p>
					<p className='text-normal'>
						После регистрации у каждого пользователя есть шанс стать финансово
						грамотным и спасти свои денежные средства вовремя.
					</p>
				</div>
				<div className='container-register'>
					<p className='text-under-table'>
						<span className='text-under-table-register'>Регистрируйся,</span> не
						пожалеешь
					</p>
				</div>
			</main>
		</>
	)
}
export default Main
