import { useEffect, useState } from 'react'
import Header from './components/organisms/header/header'
import Main from './components/organisms/main/main'
import { Route, Routes } from 'react-router-dom'

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path='*' element={<Main />} />
			</Routes>
		</>
	)
}

export default App
