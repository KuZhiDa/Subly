import { Link } from 'react-router-dom'
import './li.css'

const Li = props => {
	const { purpose, children } = props
	return (
		<>
			<li>
				<Link className='road' to={purpose}>
					{children}
				</Link>
			</li>
		</>
	)
}
export default Li
