import './style/app.css'
import Navigation from './components/navigation'
import emblem from './assets/Gemini_Generated_Image_nupgolnupgolnupg.png'

export const App = () => {
	const currentPage = 'main'
	return (
		<>
			<header className='app-header'>
				<div className='app-header-div'>
					<img className='app-img' src={emblem}></img>
					<p className='app-p'>ubly</p>
				</div>
				<Navigation page={currentPage} />
			</header>
			<main></main>
		</>
	)
}
