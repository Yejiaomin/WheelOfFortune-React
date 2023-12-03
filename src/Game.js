// Import necessary modules and styles.
import './App.css';
import { useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import  axios from 'axios';
import {PlayerNameContext} from './App'
//Array of secret phrase for guessing
const phrases = ['the light is turning on', 'try next letter', 'this is a new user', 'how are you','holiday is comming'];

//Generate a random index to select a secrete phrase
const secretIndex = Math.floor(Math.random() * phrases.length);
const secret = phrases[secretIndex].toLowerCase();
const maxGuessingTime = 5;
let wrongGuess = 0;
let score = 0;

//Function to generate a hidden phrase based on the secrete
function generateHiddenPhrase(secret){
  let output = "";
  for (let i = 0; i < secret.length; i++) {
    let ch = secret.charAt(i);
    if((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")){
      output = output + "*";
    }else{
      output = output + ' ';
    }
  }
  return output;
}

//Main Game component
function Game() {
  const auth = getAuth();

  //State variables to manage game state and user input
  const[hiddenPhrase,setHiddenPhrase]= useState(generateHiddenPhrase(secret));
  const[notice, setNotice] = useState("");
  const[guessLetter, setGuessLetter] = useState("");
  const[guessTime, setGuessTime] = useState(maxGuessingTime);
  const[previousGuess, setPreviousGuess] = useState("");
  const[gameOver,setGameOver] = useState(false);
  const {playerName} = useContext(PlayerNameContext);
  
  // Event handler for input change
  function handleChange(event){
    if(event.nativeEvent.data){
      setGuessLetter(event.nativeEvent.data.toLocaleLowerCase());
    }else{
      setGuessLetter("");
    }
  }

  //Event handler to start a new game
  function handleStartNewGame(){
    const newSecretIndex = Math.floor(Math.random() * phrases.length);
    const newSecret = phrases[newSecretIndex].toLowerCase();
    setHiddenPhrase(generateHiddenPhrase(newSecret));
    setNotice("");
    setGuessLetter("");
    setGuessTime(maxGuessingTime);
    setPreviousGuess("");
    setGameOver(false);
    wrongGuess = 0;
    score = 0;
  }

  //Event handler to show the ranking page
  function handleShowRanking(){
    window.location.href = '/ranking';
  }

  //Event handler to edit playerName
  function editPlayerName(){
    window.location.href = '/playerName';
  }

  //Event handler to check the guessed letter
  function checkGuess(){
    console.log(`playerNameCheck: ${playerName}`);
    if(gameOver){
      return;
    }
    let newHiddenPhrase = '';
    if(secret.indexOf(guessLetter) >= 0){
      for(let i = 0; i < secret.length; i++){
        let ch = secret.charAt(i);
          if(guessLetter === ch){
            newHiddenPhrase += guessLetter;
          }else if((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")){
            newHiddenPhrase +=  hiddenPhrase.charAt(i);
          }else{
            newHiddenPhrase +=  ' ';
          }
        }
        setHiddenPhrase(newHiddenPhrase);
        console.log(`hidden phrase: ${newHiddenPhrase}`);
        
        if(newHiddenPhrase === secret){
          setNotice("You won the game");
          setGameOver(true);
        }else{
          setNotice("This is a right guess");
        }
        setPreviousGuess(previousGuess+guessLetter);
      }else{
        wrongGuess++;
        if(guessTime === 1){
           setGameOver(true);
           setNotice("You loss the game");
        }else{
          setNotice("This is a wrong guess");
        }
        setGuessTime(prevGuessTime => prevGuessTime - 1);
        setPreviousGuess(previousGuess+guessLetter)
      }
      setGuessLetter("");
  }

  //Event handler to save the game record
  async function saveRecord(){
    await saveGame();
    handleShowRanking();
  }

  //Event handler to cancle saveing the game record and go back to the main page
  function cancle(){
    window.location.href = '/';
  }

  //Function to save the game to the backend
  async function saveGame(){  
    console.log(gameOver);
    score = ((maxGuessingTime - wrongGuess) *100 / maxGuessingTime); 
    console.log(`wrong guess: ${wrongGuess} ,axGuessingTime:${maxGuessingTime}, processing: ${(maxGuessingTime - wrongGuess)} ,score:${score}` )
    const postData = {
        userId:auth.currentUser.email,
        playerName:playerName,
        score:score
    };
    try{
        const response = await axios.post('https://skilful-grove-404519.ue.r.appspot.com/saveGame',postData);
    }catch(error){
        console.error('Error posting data:', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
      <div className = "secret">
        <h1>The secret phrase for gussing is:</h1>
        <h2> {hiddenPhrase}</h2>
        <h3>{guessTime} times to guess!</h3>
      </div>
      <div className = "userInput">
        <label>Guessig the phrase </label>
        <input type= "text" maxLength={1} value = {guessLetter} placeholder='letter' onChange = {handleChange}/>
        <button onClick={checkGuess} disabled={gameOver}>Submit</button>
      </div>
      <div>
        <h2>{notice}</h2>{gameOver&&
        <div>
          <label>Do you want to save this game record</label>
          <button onClick={saveRecord}>Save Record</button>
          <button onClick={cancle}>Not save</button>
        </div>}
        <button onClick={handleShowRanking}>Show Ranking</button>
        <button onClick={editPlayerName}>Edit PlayerName</button>
        <h2>Your previous guessLetter is: {previousGuess}</h2>
      </div>
      </header>
    </div>
  );
}



export default Game;
