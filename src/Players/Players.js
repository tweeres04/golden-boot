import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import _orderBy from 'lodash/orderBy';
import update from 'immutability-helper';
import _toNumber from 'lodash/toNumber';
import _map from 'lodash/map';
import { generate as generateShortId } from 'shortid';

import Player from './Player';
import PlayerModal from './PlayerModal';
import statsList from './statsList';

function playerFactory({ id = generateShortId(), name, goals = 0, mvps = 0 }) {
	return {
		id,
		name,
		goals: _toNumber(goals),
		mvps: _toNumber(mvps)
	};
}

export default function Players({
	match: {
		params: { teamId, stat = 'goals' }
	}
}) {
	const [user, setUser] = useState(null);
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [modalPlayer, setModalPlayer] = useState(null);

	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			setUser(user);
		});
	}, []);

	useEffect(() => {
		async function getPlayers() {
			const teamRef = firebase.firestore().doc(`/teams/${teamId}`);
			const teamSnapshot = await teamRef.get();

			let { players } = teamSnapshot.data() || [];

			players = players.map(playerFactory);

			setPlayers(players);
			setLoading(false);
		}

		getPlayers();
	}, [teamId]);

	async function savePlayer(player) {
		const teamRef = firebase.firestore().doc(`/teams/${teamId}`);
		const playerIndex = players.findIndex(p => p.id === player.id);
		player = playerFactory(player);
		if (playerIndex === -1) {
			teamRef.update({
				players: firebase.firestore.FieldValue.arrayUnion(player)
			});
			setPlayers(players => [...players, player]);
		} else {
			const playersPatch = update(players, {
				[playerIndex]: {
					$set: player
				}
			});
			teamRef.update({ players: playersPatch });
			setPlayers(playersPatch);
		}
	}

	function incrementField(field) {
		return function(player) {
			firebase.firestore().runTransaction(async transaction => {
				const teamRef = firebase.firestore().doc(`/teams/${teamId}`);
				const teamSnapshot = await transaction.get(teamRef);
				let { players } = teamSnapshot.data();
				players = players.map(playerFactory);
				const playerIndex = players.findIndex(p => p.id === player.id);

				const count = playerFactory(player)[field] || 0;

				const playersPatch = update(players, {
					[playerIndex]: {
						[field]: { $set: count + 1 }
					}
				});
				setPlayers(playersPatch);
				return transaction.update(teamRef, { players: playersPatch });
			});
		};
	}

	const highestStat = Math.max(...players.map(player => player[stat]));
	const sortedPlayers = _orderBy(players, [stat, 'name'], ['desc', 'asc']);

	return (
		loading || (
			<section className="section players">
				<div className="container">
					{user && (
						<div className="columns">
							<div className="column">
								<button
									className="button is-primary is-inverted"
									onClick={() => {
										setShowModal(true);
									}}
								>
									Add player
								</button>
							</div>
						</div>
					)}
					<div className="box">
						<div className="tabs">
							<ul>
								{_map(statsList, ({ url, title }, id) => (
									<li className={stat === id ? 'is-active' : ''}>
										<Link to={`/${teamId}${url}`}>{title}</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
					{players.length === 0 && (
						<div className="box content">
							<p>No players yet. Add some to get started!</p>
							<p className="has-text-centered">
								<span role="img" aria-label="soccer ball">
									⚽
								</span>
								<span role="img" aria-label="soccer ball">
									⚽
								</span>
								<span role="img" aria-label="soccer ball">
									⚽
								</span>
								<span role="img" aria-label="soccer ball">
									⚽
								</span>
								<span role="img" aria-label="soccer ball">
									⚽
								</span>
							</p>
						</div>
					)}
					{sortedPlayers.map(p => (
						<Player
							key={p.id}
							player={p}
							statField={stat}
							highestStat={highestStat}
							user={user}
							setShowModal={setShowModal}
							setModalPlayer={setModalPlayer}
							incrementField={incrementField}
						/>
					))}
					{showModal && (
						<PlayerModal
							player={modalPlayer}
							setShowModal={setShowModal}
							savePlayer={savePlayer}
							setModalPlayer={setModalPlayer}
						/>
					)}
				</div>
			</section>
		)
	);
}
