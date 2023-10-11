import React, {useState} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'
import {AiOutlineClose} from 'react-icons/ai'
import {AiFillRobot} from 'react-icons/ai'
import {HiOutlineMenuAlt4} from 'react-icons/hi'
import {FaFacebook, FaInstagram, FaPinterest, FaTwitter, FaYoutube} from 'react-icons/fa'

import './CSS/naviStyles.css'

const Navbar = () => {
	const [nav, setNav] = useState(false)
	const handleNav = () => setNav(!nav)

	return(
		<div className={nav ? 'navbar navbar-bg' : 'navbar'}>
			<div classname="logo">
				<h2>FragranceFinder</h2>
			</div>
			<ul className="nav-menu">
				<li>Home</li>
				<li>Men's</li>
				<li>Women's</li>
				<li>Unisex</li>
				<li>Bestsellers</li>
			</ul>
			<div className="nav-icons">
				<AiOutlineSearch className='icon' style={{marginRight: '1rem'}}/>
				<AiFillRobot className='icon'/>
			</div>
			<div className="hamburger" onClick={handleNav}>
				{!nav ? (<HiOutlineMenuAlt4 className='icon' />) : (<AiOutlineClose className='icon'/>)}
			</div>

			<div className={nav ? 'mobile-menu active' : 'mobile-menu'}>
				<ul className="mobile-nav">
					<li>Home</li>
					<li>Mens</li>
					<li>Womens</li>
					<li>UniSex</li>
					<li>Bestsellers</li>
				</ul>
				<div className="mobile-menu-bottom">
					<div className="menu-icons">
						<button>Search</button>
						<button>Account</button>
					</div>
					<div className="social-icons">
						<FaFacebook className='icon'/>
						<FaInstagram className='icon'/>
						<FaTwitter className='icon'/>
						<FaPinterest className='icon'/>
						<FaYoutube className='icon'/>
					</div>
				</div>
			</div>

		</div>
	)
}

export default Navbar