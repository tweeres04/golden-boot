import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import update from 'immutability-helper';
import _toNumber from 'lodash/toNumber';

function playerFactory({ name, goals }) {
	return {
		name,
		goals: _toNumber(goals)
	};
}

export default function Setup() {
	const [players, setPlayers] = useState();
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		async function getPlayers() {
			const teamRef = firebase.firestore().doc('/teams/sffc-prem-women');
			const teamSnapshot = await teamRef.get();

			const players = teamSnapshot.data().players;

			setPlayers(players);
			setLoading(false);
		}

		getPlayers();
	}, []);

	async function savePlayer(player) {
		const teamRef = firebase.firestore().doc('/teams/sffc-prem-women');
		const teamSnapshot = await teamRef.get();
		const players = teamSnapshot.data().players;
		const playerIndex = players.findIndex(p => p.name === player.name);
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

	return (
		loading || (
			<section className="section">
				<div className="container">
					<h1 className="title">Players</h1>
					<div className="columns">
						<div className="column">
							<button
								className="button is-primary"
								onClick={() => {
									setShowModal(true);
								}}
							>
								Add player
							</button>
						</div>
					</div>
					{players.length > 0 && (
						<div className="columns">
							<div className="column">
								{players.map(p => (
									<div className="card">
										<div className="card-content">{p.name}</div>
									</div>
								))}
							</div>
						</div>
					)}
					{players.length === 0 && (
						<div className="columns">
							<div className="column">
								<div className="box">No players yet. Add some!</div>
							</div>
						</div>
					)}
					{showModal && (
						<PlayerModal setShowModal={setShowModal} savePlayer={savePlayer} />
					)}
				</div>
			</section>
		)
	);
}

function PlayerModal({ setShowModal, savePlayer }) {
	const [{ name, goals }, setPlayerData] = useState({
		name: '',
		goals: 0
	});

	function closeModal() {
		setShowModal(false);
	}

	function handleChange(event) {
		setPlayerData({
			name,
			goals,
			[event.currentTarget.name]: event.currentTarget.value
		});
	}

	return (
		<div className="modal is-active">
			<div className="modal-background" />
			<div className="modal-card">
				<div className="modal-card-head">
					<p className="modal-card-title">New Player</p>
				</div>
				<div className="modal-card-body">
					<div className="field">
						<label htmlFor="name" className="label">
							Player Name
						</label>
						<div className="control">
							<input
								type="text"
								className="input"
								id="name"
								name="name"
								value={name}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="field">
						<label htmlFor="goals" className="label">
							Goals
						</label>
						<div className="control">
							<input
								type="number"
								className="input"
								id="goals"
								name="goals"
								value={goals}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
				<div className="modal-card-foot">
					<button
						className="button is-success"
						onClick={() => {
							savePlayer({ name, goals });
							closeModal();
						}}
					>
						Save
					</button>
					<button className="button" onClick={closeModal}>
						Cancel
					</button>
				</div>
			</div>
			<div className="modal-close is-large" onClick={closeModal} />
		</div>
	);
}
