import Navigation from './navigation'
import '../styles/components/header.css'
import Brand from './brand'

const Header = props => {
	let { currentPage } = props
	return (
		<header>
			<Brand />
			<Navigation page={currentPage} />
		</header>
	)
}
export default Header
