import Form from '../../molecules/form/form'
import Input from '../../atoms/input/input'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../atoms/button/button'
import Labels from '../../molecules/labels/labels'

const TwoFaAuth = () => {
	const navigate = useNavigate()
	const { email } = useParams()
	console.log(email)

	const onSubmit = event => {
		event.preventDefault()
		navigate(`/profile/${email}`)
		return
	}

	return (
		<>
			<Form purpose='2FaAuth' onSubmit={onSubmit}>
				<Labels>
					<Input
						id='code'
						name='code'
						type='code'
						classContainer='container-string-field'
						classLabel='label-string-field'
						classInput='input-string-field'
					>
						Код
					</Input>
				</Labels>
				<Button type='submit' classButton='login-register-button'>
					Отправить
				</Button>
			</Form>
		</>
	)
}
export default TwoFaAuth
