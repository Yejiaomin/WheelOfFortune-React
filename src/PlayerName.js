import React, { useState, useEffect, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import  axios from 'axios';
import {PlayerNameContext} from './App';

//PlayerName component
 function PlayerName(){

    //Access the playerName and setPlayerName from the PlayerNameContext
    const {playerName, setPlayerName} = useContext(PlayerNameContext);

    //Function to navigate back to the game
    function handlePlayGame(){
        window.location.href = '/';
      }

    //Get the authentication instance
    const auth = getAuth();
    
    //Function to handle player name creation and update
    async function handleCreatPlayerName(event) {
        event.preventDefault();

        //Dta to be sent in the POST request
        const postData = {
            userId:auth.currentUser.email,
            playerName: playerName
            
        };
        console.log(postData);

        try {

            //Save the user data
            const response = await axios.post('https://skilful-grove-404519.ue.r.appspot.com/saveUser', postData);
            console.log('Response:', response.data);
            
        } catch (error) {
            console.error('Error posting data:', error);
            alert("save failed")
        }
        try{

            //Update the player name using a GET request
            axios.get(`https://skilful-grove-404519.ue.r.appspot.com/updatePlayerNameByUserId?userId=${auth.currentUser.email}&newPlayerName=${playerName}`);
            alert("You handle name has been updated")
        }catch(error){
            console.error('Error updating player name:', error);
            alert("update failed")
        }
    };

    return(
        <div className="creat-playerName">
        <form onSubmit={handleCreatPlayerName}>
        <label className='playerName-input-box'>
        PlayerName:
            <input type="text" value={playerName} onChange={e => {
                console.log(e.target.value);
                setPlayerName(e.target.value);
                console.log(playerName);
                }
            } />
        </label>
        <button className='playerName-Submit' type="submit">submit</button>
        </form>
        <div className="buttons-container">
            <button className='back-to-play-game' onClick={handlePlayGame}>Play Game</button> 
        </div>
        
</div>
    )
 }

export default PlayerName;