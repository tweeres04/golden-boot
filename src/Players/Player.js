import React from 'react';
import Avatar from 'react-avatar';
import _noop from 'lodash/noop';

export default function Player({
	player,
	mostGoals,
	user,
	setShowModal,
	setModalPlayer
}) {
	const { goals, name } = player;
	return (
		<div
			className="player box"
			style={{ position: 'relative', ...(user ? { cursor: 'pointer' } : {}) }}
			onClick={
				user
					? () => {
							setModalPlayer(player);
							setShowModal(true);
					  }
					: _noop
			}
		>
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
