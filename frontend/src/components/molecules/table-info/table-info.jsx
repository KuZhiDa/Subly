import { Outlet, useLocation } from 'react-router-dom'
import './table-info.css'
import TextUnderTable from '../../atoms/text/table/under/under'

const TableInfo = props => {
	const location = useLocation()
	return (
		<>
			<div className='container-table'>
				<Outlet />
			</div>
			{location.pathname === '/' && <TextUnderTable />}
		</>
	)
}
export default TableInfo
