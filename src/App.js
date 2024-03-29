import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.scss';

import Navbar from './Navbar';
import Signin from './Signin';
import Teams from './Teams';
import Players from './Players/Players';

export default function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/signin" component={Signin} />
					<Route path="/:teamId/:stat?" component={Players} />
					<Route path="/" component={Teams} />
				</Switch>
			</div>
		</Router>
	);
}
