import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import faker from 'faker';
import _random from 'lodash/random';
import _orderBy from 'lodash/orderBy';
import Avatar from 'react-avatar';

import './App.scss';

import Setup from './Setup';
import Signin from './Signin';

const fakePlayers = Array.from({ length: 15 }).map(() => ({
	name: faker.name.findName(),
	goals: _random(0, 25)
}));

const sortedPlayers = _orderBy(fakePlayers, ['goals'], ['desc']);

function App() {
	const [navMenuVisible, setNavMenuVisible] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			setUser(user);
		});
	}, []);

	return (
		<Router>
			<div className="App">
				<nav className="navbar is-light">
					<div className="navbar-brand">
						<h1 className="title is-4 navbar-item is-marginless">
							The Golden Boot
						</h1>
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
				<Switch>
					<Route path="/signin" component={Signin} />
					<Route path="/setup" component={Setup} />
					<Route path="/" component={Players} />
				</Switch>
			</div>
		</Router>
	);
}

function Players() {
	const mostGoals = Math.max(...fakePlayers.map(({ goals }) => goals));
	return (
		<section className="section players">
			<div className="container">
				{sortedPlayers.map(({ name, goals }) => (
					<Player name={name} goals={goals} key={name} mostGoals={mostGoals} />
				))}
			</div>
		</section>
	);
}

function Player({ name, goals, mostGoals }) {
	return (
		<div className="player box" style={{ position: 'relative' }}>
			{mostGoals === goals && goals !== 0 && (
				<span
					role="img"
					aria-label="golden boot"
					style={{
						position: 'absolute',
						top: -25,
						right: -25,
						fontSize: '4rem'
					}}
				>
					🏆
				</span>
			)}
			<div className="columns is-vcentered">
				<div className="column info is-one-third">
					<div className="columns is-mobile is-vcentered">
						<div className="column is-narrow">
							<Avatar name={name} round size={64} />
						</div>
						<div className="column is-size-1">
							<div className="title" style={{ marginLeft: '0.5em' }}>
								{name}
							</div>
						</div>
					</div>
					<div className="columns is-mobile is-centered is-vcentered">
						<div
							className="column is-narrow has-text-centered"
							style={{ borderRadius: '0.5em' }}
						>
							<div className="title is-marginless is-1">{goals}</div>
							<div className="is-size-7">GOAL{goals !== 1 && 'S'}</div>
						</div>
					</div>
				</div>
				<div className="column is-size-5 has-text-centered">
					{goals < 1 ? (
						<span role="img" aria-label="no goals">
							🥚
						</span>
					) : (
						Array.from({ length: goals }).map((g, i) => (
							<span role="img" aria-label="goal" key={i}>
								⚽️
							</span>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
