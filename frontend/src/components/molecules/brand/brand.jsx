import './brand.css'
import logo from '../../../assets/Gemini_Generated_Image_t2fx8ht2fx8ht2fx.png'
import { Link } from 'react-router-dom'

const Brand = props => {
	const { setPage } = props
	return (
		<div className='container'>
			<Link className='button-logo' to='/'>
				<img className='logo' src={logo} alt='Логотип сайта'></img>
			</Link>
			<p className='title'>ubly</p>
		</div>
	)
}
export default Brand
