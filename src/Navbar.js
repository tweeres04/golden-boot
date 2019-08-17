import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';

export default function Navbar() {
	const [user, setUser] = useState(null);
	const [navMenuVisible, setNavMenuVisible] = useState(false);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			setUser(user);
		});
	}, []);

	return (
		<nav className="navbar is-light">
			<div className="navbar-brand">
				<Link to="/">
					<h1 className="title is-4 navbar-item is-marginless">
						The Golden Boot
					</h1>
				</Link>
				{user && <div className="navbar-item">{user.displayName}</div>}
				<div
					role="button"
					className="navbar-burger burger"
					aria-label="menu"
					aria-expanded="false"
					data-target="navbarBasicExample"
					onClick={() => {
						setNavMenuVisible(!navMenuVisible);
					}}
				>
					<span aria-hidden="true" />
					<span aria-hidden="true" />
					<span aria-hidden="true" />
				</div>
			</div>
			<div className={`navbar-menu${navMenuVisible ? ' is-active' : ''}`}>
				<div className="navbar-end">
					{user && (
						<div className="navbar-item">
							<Link to="/setup">
								<div>Setup</div>
							</Link>
						</div>
					)}
					<div className="navbar-item">
						{user ? (
							<button
								className="button"
								onClick={() => {
									firebase.auth().signOut();
								}}
							>
								Sign out
							</button>
						) : (
							<Link to="/signin">
								<button className="button">Sign in</button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
