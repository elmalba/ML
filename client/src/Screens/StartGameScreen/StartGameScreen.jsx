import React from 'react'

import Screen from "../../components/Screen/Screen"
import Top from "../../components/Top/Top"
import Title from "../../components/Title/Title"
import Bottom from "../../components/Bottom/Bottom"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Footer from "../../components/Footer/Footer"
import PlayerList from "../../components/PlayerList/PlayerList"
import Banner from 'react-js-banner';
import "./StartGameScreen.css"

import { joinParty, getLobbyState, newLobbyState } from "../../api"

class StartGameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      joined: false,
      currentPlayerName: "",
    }

    this.joinParty = this.joinParty.bind(this)
    this.updatePlayerName = this.updatePlayerName.bind(this)
  }

  componentDidMount() {
    let partyCode = this.props.match.params.partyCode
    getLobbyState(partyCode, (response) => {
      console.log(`getLobbyState ${JSON.stringify(response)}`)
      this.setState({
        joined: response.currentPlayer ? true : false,
        players: response.players
      });
    });
    newLobbyState(partyCode);
  }

  joinParty() {
    if (!this.state.joined) {
      let name = this.state.currentPlayerName
      let partyCode = this.props.match.params.partyCode
      console.log(`requesting to join party:${partyCode}`)
      joinParty({ name, partyCode });
    }
  }

  // REFACTOR: need to pass this to the PlayerList Component 
  // to retrieve the user input (nested)
  updatePlayerName(e) {
    this.setState({
      currentPlayerName: e
    });
  }

  Button() {
    if (!this.state.joined) {
      return <Button text="Ingresar" className="center" disabled={this.state.currentPlayerName.length === 0} onClick={this.joinParty} />;
    }
    else {
      return <Button text="Comenzar" className="center" disabled={this.state.players.length < 3} link={`/${this.props.match.params.partyCode}`} />;
    }
  }

  render() {
    return (
      <Screen>
        <Top>
        <Banner title="Comparte el link de la pestaña con al menos 2 amigos para poder jugar" />
          <Card cardType="Link" link={this.props.match.params.partyCode} />
        </Top>
        <Bottom>
          <Title text="Jugadores Ingresados" />
          <PlayerList players={this.state.players} joined={this.state.joined} className="center" onChange={this.updatePlayerName} />
          {this.Button()}
          <Footer>
            {this.state.players.length < 3 ? "Se necesitan al menos 3 jugadores" : "Ya podemos comenzar!"}<br/>
            Powered By  <a href="https://www.linkedin.com/in/manuel-alba-689619171/"> elmalba!</a>

          </Footer>
        </Bottom>
      </Screen>
    );
  }
}

export default StartGameScreen;
