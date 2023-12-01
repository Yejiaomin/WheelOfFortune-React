import React, { useState, useEffect } from 'react';
import Login from "./Login";
import Game from './Game';
import Ranking from './Ranking';
import GameId from './GameId';
import { Navigate, BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import  axios from 'axios';

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
  const[loadingGameId,setLoadingGameId] = useState(true);
  const[gameId,setGameId] = useState("");

   function getGameId(userId){
      axios.get(`https://skilful-grove-404519.ue.r.appspot.com/findGameIdByUserId?userId=${userId}`)
      .then(response => {
        console.log(response.data);
        setGameId(response.data);
        setLoadingGameId(false);
      })
      .catch(error => {
        console.log(error);
        setLoadingGameId(false);
      });
  }

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
   getGameId(user.email);
   if (loadingGameId) {
    return (<div>
      <p>Loading Game Id...</p>
    </div>);
   }
  console.log(user);
  console.log(gameId);
  return (
      <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/gameId" /> : <Login />}
        />
        <Route
          path="/"
          element={user ? <Game /> : <Navigate to="/login" />}
        />
        <Route
          path="/ranking"
          element={<Ranking gameId = {gameId}/>}
        />
        <Route
        path = "/gameId"
        element={<GameId initialGameId={gameId}/>}
        />
      </Routes>
      </Router>
  );
}

export default App;