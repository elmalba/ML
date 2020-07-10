import React,{Component} from 'react'
import "./PlayerSelectionScreen.css"

// Import SharedComponents
import Screen from "../../components/Screen/Screen"
import Top from "../../components/Top/Top"
import HeaderMenu from "../../components/HeaderMenu/HeaderMenu"
import DropCardSpace from "../../components/DropCardSpace/DropCardSpace"
import Bottom from "../../components/Bottom/Bottom"
import CardCarousel from "../../components/CardCarousel/CardCarousel"
import Footer from "../../components/Footer/Footer"
import Status from "../../components/Status/Status"

// Import Helper Libraries
import { DragDropContext } from "react-beautiful-dnd";
import { getPlayerRoundState, newGameState, playCard, judgeSelectCard, shuffleCards, endRound } from "../../api"

import {Launcher} from 'react-chat-window'
import firebaseConfig from '../../firebase';
import * as firebase from 'firebase/app';
import 'firebase/database';

const db = firebaseConfig.database();





let code = "";
var user = firebaseConfig.auth();
class Demo extends Component {

  constructor() {
    super();
    this.state = {
      messageList: []
    };


    console.log("USER",user);

    let pcode = window.location.pathname.split("/")[1]
    db.ref('/chat-'+pcode).on('value', querySnapShot => {
      //console.log("HOOLA",querySnapShot.val() )
      let data = querySnapShot.val() ;
      let messageList=[];
      for (var [key, value] of Object.entries(data)) {
        console.log()
        if (value.message.author == user.currentUser.email ){
          value.message.author='me';
        } else {
          value.message.author='them';
        }
        messageList.push(value.message);
      }
      this.setState({messageList:messageList})
      
    });


  }

  _onMessageWasSent(message) {

    this.setState({
      messageList: [...this.state.messageList, message]
    })
    message.author= user.currentUser.email 
    message.data.text=user.currentUser.displayName+" : "+message.data.text
    db.ref('/chat-'+code).push({message})
  }

  _sendMessage(text) {
    if (text.length > 0) {
      console.log("DATA",{data:text,author:"Manuel Alba"})
      db.ref('/chat').push({data:text,author:"Manuel Alba"})
      this.setState({
        messageList: [...this.state.messageList, {
          author: 'me',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  render() {
    console.log("DB",db );
    return (<div>
      <Launcher
        agentProfile={{
          teamName: 'Chat de esta Sala',
          imageUrl: '/pixil-frame-0.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showFile={false}
        showEmoji
      />
    </div>)
  }
}

class PlayerSelectionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.restoreScreen = this.restoreScreen.bind(this);

    // roundRole: player
    // roundState:
    //    player-selecting -> player-waiting -> judge-selecting -> viewing-winner -> [player-selecting | judge-selecting]
    // 
    // roundRole: judge
    // roundState
    //    judge-waiting -> judge-selecting -> viewing-winner -> [player-selecting]

    this.state = {
      // get these on getRoundState
      roundState: "viewing-winner",  // player-selecting | player-waiting | judge-selecting | viewing-winner
      roundRole: "judge", // player | judge
      roundJudge: "Yusuf",
      roundNum: null, // Number
      QCard: {
        cardType: "Q",
        text: `Entra a la sala con el código ${this.props.match.params.partyCode} para jugar`,
        id: 69
      },
      cards: [
        {
          type: "A",
          text: "Hey dummy!",
          id: 0
        },
        {
          type: "A",
          text: "Join the game from the home screen before starting!",
          id: 1
        }
      ],

      // these should be set implicitely based on above state
      directions: "Esperando por mas jugadores",
      headerText: `Entra a la sala para jugar`,

      // this is set when user selects a card
      playerChoice: null, // type=Card

      // these are set for everyone as everyone is selecting their own cards
      otherPlayerCards: [
        {
          type: "A",
          text: "(Salmans Card)",
          id: 10,
          owner: {
            name: "Salman",
            pID: 2
          }
        },
        {
          type: "A",
          text: "(Reza's Card)",
          id: 11,
          owner: {
            name: "Reza",
            pID: 1
          }
        }
      ],

      // this is set when judge selects a card
      winningCard: { // type=Card || null
        cardType: "A",
        text: `Invita a mas amigos para comenzar`,
        id: 42
      },
    }
  }

  componentDidMount() {
    console.log("PlayerSelectionScreen: componentDidMount()")
    let partyCode = this.props.match.params.partyCode
    code = partyCode;
    let newState = (roundState) => {
      if(roundState == null) {
        // redirect them to join
        if(partyCode === 'join') {
          this.props.history.push(`/join`)
        }
        else {
          this.props.history.push(`/join/${partyCode}`)
        }
        return;
      }
      console.log(`${new Date().getMinutes()}:${new Date().getSeconds()}`)
      console.log('RoundState:', roundState)
      let headerText = ''
      let directions = ''
      if (roundState.roundState === 'viewing-winner') {
        headerText = `${roundState.winner} Ganó!`
        directions = '';
      }
      else if (roundState.roundRole === 'judge') {
        headerText = `Tú eres el Dealer`
        if (roundState.roundState === 'judge-waiting') directions = 'Esperando a los otros jugadores';
        else if (roundState.roundState === 'judge-selecting') directions = 'Elige la mejor combinación';
      }
      else {
        headerText = `${roundState.roundJudge} es el Dealer`
        if (roundState.roundState === 'player-selecting') directions = 'Elige una carta';
        else if (roundState.roundState === 'player-waiting') directions = 'Esperando a los otros jugadores';
        else if (roundState.roundState === 'judge-selecting') directions = `${roundState.roundJudge}  está eligiendo la mejor combinación`
      }

      this.setState({
        QCard: roundState.QCard,
        cards: roundState.cards,
        otherPlayerCards: roundState.otherPlayerCards,
        roundNum: roundState.roundNum,
        roundRole: roundState.roundRole,
        roundJudge: roundState.roundJudge,
        headerText,
        roundState: roundState.roundState,
        winner: roundState.winner,
        winningCard: roundState.winningCard,
        timeLeft: roundState.timeLeft,
        directions
      });

      if (this.state.ticker) {
        console.log('updated timeLeft!, deleting ticker')
        clearInterval(this.state.ticker)
      }
      var ticker = setInterval(() => {
        if (this.state.timeLeft <= 0) {
          console.log('clearing interval timeout!', ticker)
          clearInterval(ticker)
        }
        else {
          console.log('tick');
          this.setState({
            timeLeft: this.state.timeLeft - 1,
            ticker
          });
        }
      }, 1000);
    };

    // ask server to send current gameStateEvents
    getPlayerRoundState(partyCode, newState);
    // subscribe to newGameState events
    newGameState(partyCode); 
  }

  componentWillUnmount() {
    console.log("PlayerSelectionScreen: componentWillUnmount()")
    clearInterval(this.state.ticker);
  }

  // called after viewing-winner, resets state and gets new state from server. Begins new round
  restoreScreen() {
    let partyCode = this.props.match.params.partyCode
    code = partyCode;

    endRound(partyCode);
    console.log("restoring screen");
  }

  // choosing card logic (drag-and-drop)
  chooseCardHandler = result => {
    const { destination, source } = result;
    // console.log(result);
    
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // shift/move cards in correct order @ CardCarousel
      console.log("swapping!")
      let partyCode = this.props.match.params.partyCode
      code = partyCode;

      shuffleCards(partyCode, source.index, destination.index)
    }
    else if (source.droppableId === "bottom" && destination.droppableId === "top" && this.state.playerChoice == null) {
      if (this.state.roundState === 'judge-selecting' && this.state.roundRole === 'judge') {
        // judge-selecting card
        console.log(`winner card chosen: ${JSON.stringify(this.state.otherPlayerCards[source.index])}`);
        let partyCode = this.props.match.params.partyCode
        code = partyCode;

        judgeSelectCard(partyCode, this.state.otherPlayerCards[source.index].id);
      }
      else {
        // player-selecting card
        console.log("player chose a card!");
        let partyCode = this.props.match.params.partyCode
        code = partyCode;
        playCard(partyCode, this.state.cards[source.index].id)
      }
    }
  }

  // vibrate when dragging card
  onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    };
  }

  render() {
    return (
      <Screen>
        <DragDropContext onDragEnd={this.chooseCardHandler} onDragStart={this.onDragStart}>
          <Top className={this.state.roundState === 'viewing-winner' ? 'winner' : ''}>
            <HeaderMenu
              text={this.state.headerText}
              timeLeft={this.state.timeLeft}
            />
            <DropCardSpace
              QCard={this.state.QCard}
              playerChoice={this.state.roundState === 'viewing-winner' ? this.state.winningCard : this.state.playerChoice}
              cardsIn={this.state.otherPlayerCards.length}
              roundState={this.state.roundState}
              roundRole={this.state.roundRole}
              roundJudge={this.state.roundJudge}
            />
            <div className={this.state.roundState === 'viewing-winner' ? 'continueMsg' : ''} id="continueMsg" onClick={this.restoreScreen}>
              {this.state.roundState === 'viewing-winner' ? "Da clic en cualquier lado para continuar" : ""}
            </div>
          </Top>
          <Bottom>
            <Status message={this.state.directions} />
            <CardCarousel
              cards={
                this.state.roundState === 'judge-selecting' ? this.state.otherPlayerCards :
                  this.state.roundState === 'judge-waiting' ? [] : this.state.cards
              } />
            <Footer>
            Comparte este link o el código de sala para invitar amigos: {this.props.match.params.partyCode} <br/>
            Powered By  <a href="https://www.linkedin.com/in/manuel-alba-689619171/"> elmalba!</a>
            <Demo  code={this.props.match.params.partyCode}/>
            </Footer>
          </Bottom >
        </DragDropContext >
      </Screen >
    );
  }
}

export default PlayerSelectionScreen;
