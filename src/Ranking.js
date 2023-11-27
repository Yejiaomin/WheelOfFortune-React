import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import GameId from './GameId';

function Ranking({gameId}) {
  console.log(gameId);
    const [games, setGames] = useState([]);
    const [usergames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth();

    function displayAllGames() {
        axios.get('https://skilful-grove-404519.ue.r.appspot.com/findAllGames')
        .then(response => {
          setGames(response.data);  // Axios packs the response in a 'data' property
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    
    };
    function displayGamesByUserId() {
        axios.get(`https://skilful-grove-404519.ue.r.appspot.com/findGameByUserId?userId=${auth.currentUser.email}`)
        .then(response => {
            console.log('Response:', response.data);
            setUserGames(response.data);  // Axios packs the response in a 'data' property
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      };

      function handlePlayGame(){
        window.location.href = '/';
      }
      function handleDelete(id){
        axios.get(`https://skilful-grove-404519.ue.r.appspot.com/deleteGameById?id=${id}`)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
      }

    useEffect(() => {
        // Using Axios to fetch data
        displayAllGames()
        displayGamesByUserId()
      }, []);
  return (
    <div className="game-list">
      <div className="all-game-list">
        <div className="game-list-header">
          <h1>All Users</h1>
          <h1>Top 10 game records</h1>
        </div>
        {games.map(game => (
          <div className="game-item">
            <p>{game.userId} score: {game.score} at {game.date}</p> 
          </div>
        ))}
      </div>
      <div className="user-game-list">
      <div className="game-list-header">
        <h1>{auth.currentUser.email}</h1>
        <h1>All game records</h1>
        </div>
        {usergames.map(usergame => (
          <div className="game-item">
            {usergame.userId} score: {usergame.score} at {usergame.date}<button className = "delete-button"onClick={()=>handleDelete(usergame.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div >
        <button className="play-game-button" onClick={handlePlayGame}>Play Game</button> 
        <p className="show-game-id">currentGameId: {gameId}</p>
      </div>
     
    </div>
  );
}

export default Ranking;