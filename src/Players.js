import React from 'react';
import faker from 'faker';
import _random from 'lodash/random';
import _orderBy from 'lodash/orderBy';
import Avatar from 'react-avatar';

const fakePlayers = Array.from({ length: 15 }).map(() => ({
	name: faker.name.findName(),
	goals: _random(0, 25)
}));

const sortedPlayers = _orderBy(fakePlayers, ['goals'], ['desc']);

export default function Players() {
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
