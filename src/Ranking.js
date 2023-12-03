import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import PlayerName from './PlayerName';

//Ranking componente
function Ranking() {
    const [games, setGames] = useState([]);
    const [usergames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth();
    const[allGamescurrentPage,setAllGamesCurrentPage] = useState(0);
    const[userGamescurrentPage,setUserGamesCurrentPage] = useState(0);
    const size = 2;
    const[totalPageOfAllGames,setTotalPageOfAllGames] = useState(0);
    const[ totalPageOfUserGames,setTotalPageOfUserGames ] = useState(0);

    //Function to handle moving to the previous page for all games ranking
    function handleAllGamePreviousPage(){
      if(allGamescurrentPage > 0){
        setAllGamesCurrentPage(allGamescurrentPage-1);
      }
     
    }

    //Function to handle moving to the next page for all games ranking
    function handleAllGameNextPage(){
      if(allGamescurrentPage < totalPageOfAllGames -1){
        setAllGamesCurrentPage(allGamescurrentPage+1);
      }
    }

    //Function to hadle moving to the previous page for user games ranking 
    function handleUserGamePreviousPage(){
      if(userGamescurrentPage > 0){
        setUserGamesCurrentPage(userGamescurrentPage-1);
      }
      
    }    
    
    //Function to hadle moving to the next page for user games ranking 
    function handleUserGameNextPage(){
      if(userGamescurrentPage < totalPageOfUserGames -1){
        setUserGamesCurrentPage(userGamescurrentPage+1);
      }
    }

    //Function to display all games records
    async function displayAllGames() {
        await axios.get(`https://skilful-grove-404519.ue.r.appspot.com/findAllGames?page=${allGamescurrentPage}&size=${size}`)
        .then(response => {
          setGames(response.data.content);  // Axios packs the response in a 'data' property
          setTotalPageOfAllGames(response.data.totalPages);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    };

    //Function to display a particular games records
    async function displayGamesByUserId() {
        await axios.get(`https://skilful-grove-404519.ue.r.appspot.com/findGameByUserId?userId=${auth.currentUser.email}&page=${userGamescurrentPage}&size=${size}`)
        .then(response => {
            console.log('Response:', response.data);
            setUserGames(response.data.content); // Axios packs the response in a 'data' property
            setTotalPageOfUserGames(response.data.totalPages);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      };

      //Function to navigate back to the game
      function handlePlayGame(){
        window.location.href = '/';
      }
      
      //Function to handle deleting a game
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

    //useEffect to fetch all games on component mount or when when allGamescurrentPage changes 
    useEffect(() => {
        // Using Axios to fetch data
        displayAllGames()
      }, [allGamescurrentPage]);

    //useEffect to fetch user games on component mount or when when userGamescurrentPage changes 
    useEffect(() => {
      displayGamesByUserId();
    }, [userGamescurrentPage]);
  return (
    <div className="game-list">
      <div className="all-game-list">
        <div className="game-list-header">
          <h1>All Users</h1>
          <h1>game records</h1>
        </div>
        {games && games.length > 0 ? (
        games.map(game => (
          <div className="game-item">
            <p>{game.playerName} score: {game.score} at {game.date}</p> 
          </div>
        ))) :(
          <p >No games available</p>
        )}
        <div className='games-page'>
          <button className='all-games-previous-page' onClick={handleAllGamePreviousPage}>Previous</button>
          {allGamescurrentPage + 1} / {totalPageOfAllGames}
          <button className='all-games-next-page' onClick={handleAllGameNextPage}>Next</button>
         </div>
      </div>
      <div className="user-game-list">
      <div className="game-list-header">
        <h1>{auth.currentUser.email}</h1>
        <h1>All game records</h1>
        </div>
        { usergames && usergames.length >0 ? (
          usergames.map(usergame => (
          <div className="game-item">
            {usergame.playerName} score: {usergame.score} at {usergame.date}<button className = "delete-button"onClick={()=>handleDelete(usergame.id)}>Delete</button>
          </div>
        ))):(
          <p >No usergames available</p>
        )}
        <div className='games-page'>
          <button className='user-games-previous-page' onClick={handleUserGamePreviousPage}>Previous</button>
          {userGamescurrentPage + 1} / {totalPageOfUserGames}
          <button  className='user-games-next-page' onClick={handleUserGameNextPage}>Next</button>
          </div>
      </div>
      <div >
        <button className="play-game-button" onClick={handlePlayGame}>Play Game</button> 
      </div>
     
    </div>
  );
}

export default Ranking;