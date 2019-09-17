import React, { useState } from 'react';

export default function PlayerModal({
	player,
	setShowModal,
	savePlayer,
	setModalPlayer
}) {
	const [playerData, setPlayerData] = useState(
		player || { name: '', goals: 0, mvps: 0 }
	);

	function closeModal() {
		setShowModal(false);
		setModalPlayer(null);
	}

	function handleChange(event) {
		setPlayerData({
			...playerData,
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
								value={playerData.name}
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
								value={playerData.goals}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="field">
						<label htmlFor="mvps" className="label">
							MVPs
						</label>
						<div className="control">
							<input
								type="number"
								className="input"
								id="mvps"
								name="mvps"
								value={playerData.mvps}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
				<div className="modal-card-foot">
					<button
						className="button is-success"
						onClick={() => {
							savePlayer(playerData);
							setModalPlayer(null);
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
