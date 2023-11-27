import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import  axios from 'axios';



 function GameId({initialGameId}){

    function handlePlayGame(){
        window.location.href = '/';
      }

    console.log(initialGameId);
    const auth = getAuth();
    const[gameId,setGameId] = useState(initialGameId);
    async function handleCreatGameId(event) {
        event.preventDefault();
        const postData = {
            userId:auth.currentUser.email,
            gameId,
            
        };
        console.log(postData);

        try {
            const response = await axios.post('https://skilful-grove-404519.ue.r.appspot.com/saveUser', postData);
            console.log('Response:', response.data);
            alert("save successfully")
        } catch (error) {
            console.error('Error posting data:', error);
            alert("save failed")
        }
    };

    return(
        <div className="creat-game-id">
        <form onSubmit={handleCreatGameId}>
        <label>
            GameId:
            <input type="text" value={gameId} onChange={e => {
                console.log(auth.currentUser.email);
                setGameId(e.target.value)}} />
        </label>
        <br />
        <button type="submit">submit</button>
        </form>
    <button onClick={handlePlayGame}>Play Game</button> 
</div>
    )
 }

export default GameId;