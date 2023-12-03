import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

//Login component
function Login() {

	//Save variable to store the user's ID
	const [userId, setUserId] = useState('');

	//Function to sign in with Google acount
	const signInWithGoogle = () => {

	//Creat a new GoogleAuthProvider instance
  	const provider = new GoogleAuthProvider();

	//Get the authentication instance
  	const auth = getAuth();

	//Sign in with Google using redirect
  	signInWithRedirect(auth, provider)
    	.then((result) => {
      		// User signed in
      		console.log(result.user);
    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};

	//Get the authentication instance
	const auth = getAuth();

	//Listen for changes in the authentication state
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