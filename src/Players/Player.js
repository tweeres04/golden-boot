import React from 'react';
import Avatar from 'react-avatar';
import _noop from 'lodash/noop';

import statsList from './statsList';

export default function Player({
	player,
	statField,
	highestStat,
	user,
	setShowModal,
	setModalPlayer,
	incrementField
}) {
	const { name } = player;
	const stat = player[statField] || 0;
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
			{highestStat === stat && stat !== 0 && (
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
						<div className="column" />
						<div
							className="column is-narrow has-text-centered"
							style={{ borderRadius: '0.5em' }}
						>
							<div className="title is-marginless is-1">{stat}</div>
							<div className="is-size-7">
								{(stat !== 1
									? statsList[statField].plural
									: statsList[statField].singular
								).toUpperCase()}
							</div>
						</div>
						<div className="column has-text-centered">
							{user && (
								<button
									className="button is-large is-rounded"
									onClick={e => {
										e.stopPropagation();
										incrementField(statField)(player);
									}}
								>
									<span role="img" aria-label="plus">
										+1
									</span>
								</button>
							)}
						</div>
					</div>
				</div>
				<div className="column is-size-5 has-text-centered">
					{stat < 1 ? (
						<span role="img" aria-label="no stat">
							🥚
						</span>
					) : (
						Array.from({ length: stat }).map((s, i) => (
							<span role="img" aria-label={statField} key={i}>
								{statsList[statField].emoji}
							</span>
						))
					)}
				</div>
			</div>
		</div>
	);
}
