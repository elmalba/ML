import React from 'react'

import Button from "../../components/Button/Button"
import Top from "../../components/Top/Top"
import Title from "../../components/Title/Title"
import Card from "../../components/Card/Card"
import Screen from "../../components/Screen/Screen"
import Bottom from "../../components/Bottom/Bottom"
import Footer from "../../components/Footer/Footer"
import "./HomeScreen.css"

function Or() {
  return (
    <div className="orDiv">
      <span className="orText">
        o
      </span>
    </div>
  );
}

function CreateGame() {
  // TODO: call backend api to create a game and return the party code,
  // mocking the response for now...
  let partyCodeFromServer = Math.random().toString(36).slice(2).substring(5).toLowerCase();
  console.log(`partyCodeFromServer ${partyCodeFromServer}`);
  
  return partyCodeFromServer;
}

function HomeScreen() {
  return (
    <Screen>
      <Top>
        {/* <Card cardType="Title" /> */}
      </Top>
      <Bottom>
        <Title text="Mala Leche Online"/>
        <Button text="Crear Sala " className="center" link={`/join/${CreateGame()}`}/>
        <Or />
        <Button text="Entrar a Sala" className="center" link="/join"/>
        <Footer>
          Siguenos en <a href="https://instagram.com/juegamalaleche"> Instagram!</a> <br/>
          Powered By  <a href="https://www.linkedin.com/in/manuel-alba-689619171/"> elmalba!</a>
        </Footer>
      </Bottom>
    </Screen>
  );
}

export default HomeScreen;
