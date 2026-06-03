import { useState } from 'react'
import Header from './components/header'
import Main from './components/main'
import './styles/app.css'

function App() {
	let currentPage = 'register'
	return (
		<>
			<Header currentPage={currentPage} />
			<Main currentPage={currentPage} />
		</>
	)
}

export default App
