import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

function Login() {
	const [userId, setUserId] = useState('');
	const signInWithGoogle = () => {
  	const provider = new GoogleAuthProvider();
  	const auth = getAuth();
  	signInWithRedirect(auth, provider)
    	.then((result) => {
      		// User signed in
      		console.log(result.user);
    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};

	const auth = getAuth();
	auth.onAuthStateChanged(user => {
		if (user) {
    		// User is signed in.
    		console.log("User is signed in:", user);
    		setUserId(user.uid)
  		} else {
    		// No user is signed in.
    		console.log("No user is signed in.");
  		}
	});


  
  return (
    <div >
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p>{userId}</p>
    </div>
  );
}

export default Login;