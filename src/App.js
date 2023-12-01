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

export const PlayerNameContext = createContext();


const firebaseConfig = {
  apiKey: "AIzaSyCCLKz_yEJS7oh59SQ3H6lMgKAGBGHAJ-0",
  authDomain: "user-login-for-booklist.firebaseapp.com",
  projectId: "user-login-for-booklist",
  storageBucket: "user-login-for-booklist.appspot.com",
  messagingSenderId: "453610822850",
  appId: "1:453610822850:web:e39a09f475d5c910ca2f5b",
  measurementId: "G-JJ741RB432"
  };
  
  initializeApp(firebaseConfig);

function App() {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const[playerName,setPlayerName] = useState(null);

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

  if(loading){
    return (<div>
      <p>Initialising User...</p>
    </div>);
  }
  if(error){
    return (<div>
      <p>auth errorr...</p>
    </div>);
  }
  if(playerName == null){
    findPlayerNameByUserId();
  }
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