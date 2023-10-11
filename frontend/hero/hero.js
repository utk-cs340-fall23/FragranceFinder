import React from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import './heroStyles.css'

import Video from '../assets/perfumeCreation.mp4'

function Hero(){
	return(
		<div className='hero'>
			<video autoPlay loop muted id='video'>
				<source src={Video} type='video/mp4' />
			</video>
			<div className='overlay'>
				<div className='content'>
					<h1>Best in Class Smell</h1>
					<h2>Top 1% for the 99%</h2>
					<form className="form">
						<div>
							<input type="text" placeholder='Search Smells'/>
						</div>
						<div>
							<button><AiOutlineSearch className='icon'/></button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Hero