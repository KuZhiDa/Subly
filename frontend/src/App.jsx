import { useEffect, useState } from 'react'
import Header from './components/organisms/header/header'
import Main from './components/organisms/main/main'
import { Routes, Route } from 'react-router-dom'
import Wait from './components/molecules/wait/wait'

function App() {
	return (
		<>
			<Routes>
				<Route path='/wait' element={<Wait />} />
				<Route
					path='*'
					element={
						<>
							<Header />
							<Main />
						</>
					}
				/>
			</Routes>
		</>
	)
}

export default App
