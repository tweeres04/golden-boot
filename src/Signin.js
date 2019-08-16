import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';

import 'firebaseui/dist/firebaseui.css';

export default function Signin() {
	useEffect(() => {
		const uiConfig = {
			signInSuccessUrl: 'http://localhost:3000',
			signInOptions: [
				firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID
			]
		};

		const ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebaseui', uiConfig);
	}, []);
	return <div id="firebaseui" />;
}
