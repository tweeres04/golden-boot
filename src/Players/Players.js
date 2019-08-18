import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import _orderBy from 'lodash/orderBy';
import update from 'immutability-helper';
import _toNumber from 'lodash/toNumber';
import { generate as generateShortId } from 'shortid';

import Player from './Player';
import PlayerModal from './PlayerModal';

function playerFactory({ id = generateShortId(), name, goals }) {
	return {
		id,
		name,
		goals: _toNumber(goals)
	};
}

export default function Players() {
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
			const teamRef = firebase.firestore().doc('/teams/sffc-prem-women');
			const teamSnapshot = await teamRef.get();

			const { players } = teamSnapshot.data() || [];

			setPlayers(players);
			setLoading(false);
		}

		getPlayers();
	}, []);

	async function savePlayer(player) {
		const teamRef = firebase.firestore().doc('/teams/sffc-prem-women');
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

	function incrementGoals(player) {
		firebase.firestore().runTransaction(async transaction => {
			const teamRef = firebase.firestore().doc('/teams/sffc-prem-women');
			const teamSnapshot = await teamRef.get();
			const { players } = teamSnapshot.data();
			const playerIndex = players.findIndex(p => p.id === player.id);

			const { goals } = playerFactory(player);

			const playersPatch = update(players, {
				[playerIndex]: {
					goals: { $set: goals + 1 }
				}
			});
			teamRef.update({ players: playersPatch });
			setPlayers(playersPatch);
		});
	}

	const mostGoals = Math.max(...players.map(({ goals }) => goals));
	const sortedPlayers = _orderBy(players, ['goals'], ['desc']);

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
							player={p}
							mostGoals={mostGoals}
							user={user}
							setShowModal={setShowModal}
							setModalPlayer={setModalPlayer}
							incrementGoals={incrementGoals}
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
