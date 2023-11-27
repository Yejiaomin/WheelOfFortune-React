// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import  axios from 'axios';
// import { useState } from 'react';
const phrases = ['the light', 'next letter', 'new user'];
const secretIndex = Math.floor(Math.random() * phrases.length);
const secret = phrases[secretIndex].toLowerCase();
const maxGuessingTime = 5;
let wrongGuess = 0;
let score = 0;

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


function Game() {
  const auth = getAuth();
  const[hiddenPhrase,setHiddenPhrase] = useState(generateHiddenPhrase(secret));
  const[notice, setNotice] = useState("");
  const[guessLetter, setGuessLetter] = useState("");
  const[guessTime, setGuessTime] = useState(maxGuessingTime);
  const[previousGuess, setPreviousGuess] = useState("");
  const[gameOver,setGameOver] = useState(false);
//   const [score, setScore] = useState(0);

  // const[startNewGame,setStartNewGame] = useState(false);

  function handleChange(event){
    if(event.nativeEvent.data){
      setGuessLetter(event.nativeEvent.data.toLocaleLowerCase());
    }else{
      setGuessLetter("");
    }
  }
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

  function handleShowRanking(){
    window.location.href = '/ranking';
  }

  function editGameId(){
    window.location.href = '/gameId';
  }
  function checkGuess(){
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
          saveGame();
        }else{
          setNotice("This is a right guess");
        }
        setPreviousGuess(previousGuess+guessLetter);
      }else{
        wrongGuess++;
        if(guessTime === 1){
           setGameOver(true);
           setNotice("You loss the game");
           saveGame();
        }else{
          setNotice("This is a wrong guess");
        }
        setGuessTime(prevGuessTime => prevGuessTime - 1);
        setPreviousGuess(previousGuess+guessLetter)
      }
      setGuessLetter("");
  }
  function saveRecord(){
    saveGame();
    window.location.href = '/';
  }
  function cancle(){
    window.location.href = '/';
  }

  async function saveGame(){  
    console.log(gameOver);
    score = ((maxGuessingTime - wrongGuess) *100 / maxGuessingTime); 
    console.log(`wrong guess: ${wrongGuess} ,axGuessingTime:${maxGuessingTime}, processing: ${(maxGuessingTime - wrongGuess)} ,score:${score}` )
    const postData = {
        userId:auth.currentUser.email,
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
        <form>
        <label>Do you want to save this game record</label>
        <button onClick={saveRecord}>Save Record</button>
        <button onClick={cancle}>Not save</button>
        </form>}
        <button onClick={handleShowRanking}>Show Ranking</button>
        <button onClick={editGameId}>Edit Game Id</button>
        <h2>Your previous guessLetter is: {previousGuess}</h2>
      </div>
      </header>
    </div>
  );
}



export default Game;
