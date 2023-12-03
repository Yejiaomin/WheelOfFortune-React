// Import necessary modules from React and other libraries.
import React, {createContext ,useState, useEffect } from 'react';
import Login from "./Login";
import Game from './Game';
import Ranking from './Ranking';
import PlayerName from './PlayerName';
import { Navigate, BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';

// Creat a context for PlyerName to be shared among components
export const PlayerNameContext = createContext();

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCLKz_yEJS7oh59SQ3H6lMgKAGBGHAJ-0",
  authDomain: "user-login-for-booklist.firebaseapp.com",
  projectId: "user-login-for-booklist",
  storageBucket: "user-login-for-booklist.appspot.com",
  messagingSenderId: "453610822850",
  appId: "1:453610822850:web:e39a09f475d5c910ca2f5b",
  measurementId: "G-JJ741RB432"
  };

// Initialize Firebase with the provided configuration
initializeApp(firebaseConfig);

// Main App component
function App() {
  
  //Get the authentication instance
  const auth = getAuth();

  //Check the authentication state and retrive user details
  const [user, loading, error] = useAuthState(auth);

  //state to store the plyerName
  const[playerName,setPlayerName] = useState(null);

  //Function to fetch the playerName by userId
  function findPlayerNameByUserId() {
    if(auth.currentUser){
      axios.get(`https://skilful-grove-404519.ue.r.appspot.com/findPlayerNameByUserId?userId=${auth.currentUser.email}`)
    .then(response => {
      setPlayerName(response.data);  // Axios packs the response in a 'data' property
    })
    .catch(error => {
      // setError(error.message);
      console.log(error.message);
    });
    }else{
      console.log('User not authenticated');
    }
    
};

//if the app is still loading , show a lodaing message.
  if(loading){
    return (<div>
      <p>Initialising User...</p>
    </div>);
  }

  //If there is an error, show an error message
  if(error){
    return (<div>
      <p>auth errorr...</p>
    </div>);
  }

  //If playerName is null, fetch it
  if(playerName == null){
    findPlayerNameByUserId();
  }

  // Return the main content using React Router
  return (
    <PlayerNameContext.Provider value = {{playerName, setPlayerName}} >
      <Router>
      {/* add playerName and setPlayerName to the PlayerNameContext. */}
     
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/playerName" /> : <Login />}
        />
        <Route
          path="/"
          element={user ? <Game /> : <Navigate to="/login" />}
        />
        <Route
          path="/ranking"
          element={<Ranking />}
        />
        <Route
        path = "/playerName"
        element={<PlayerName />}
        />
      </Routes>
      
      </Router>
      </PlayerNameContext.Provider>
  );
}

export default App;