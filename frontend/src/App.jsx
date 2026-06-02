import { useState } from 'react'
import Header from './components/header'
import Main from './components/main'
function App() {
	const currentPage = 'main'
	return (
		<>
			<Header currentPage={currentPage} />
			<Main />
		</>
	)
}

export default App
