import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';

export default function Teams() {
	const [teams, setTeams] = useState([]);

	useEffect(() => {
		async function getTeams() {
			const teamsSnapshot = await firebase
				.firestore()
				.collection('teams')
				.get();
			const teams = teamsSnapshot.docs.map(d => ({
				id: d.id,
				...d.data()
			}));
			setTeams(teams);
		}

		getTeams();
	}, []);

	return (
		teams.length > 0 && (
			<section className="section teams">
				<div className="container">
					{teams.map(({ id, name }) => (
						<div className="card" key={id}>
							<Link to={`/${id}`}>
								<div className="card-content">{name}</div>
							</Link>
						</div>
					))}
				</div>
			</section>
		)
	);
}
