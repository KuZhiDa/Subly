import '../styles/components/main.css'
import TableInfo from './table-info'
import '../styles/components/table-info.css'

const Main = props => {
	const { currentPage } = props
	return (
		<>
			<main>
				<TableInfo currentPage={currentPage} />
			</main>
		</>
	)
}
export default Main
