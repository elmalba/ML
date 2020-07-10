import React from 'react'

import Screen from "../../components/Screen/Screen"
import Top from "../../components/Top/Top"
import Title from "../../components/Title/Title"
import Bottom from "../../components/Bottom/Bottom"
import Button from "../../components/Button/Button"
import Card from "../../components/Card/Card"
import Footer from "../../components/Footer/Footer"
import Banner from 'react-js-banner';
import "./JoinPartyScreen.css"


class JoinPartyScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      partyCode: ""
    }

    this.updatePartyCode = this.updatePartyCode.bind(this);
  }

  updatePartyCode(e) {
    this.setState({
      partyCode: e.target.value.toLowerCase()
    })
  }


  render() {
    return (
      <Screen>
        <Top>
          <Banner title = "Pregúntale a tus amigos por el código de la sala o crea una sala tu mismo"/>
          <Card cardType="Title" />
        </Top>
        <Bottom>
          <Title text={`Entra a una sala`} />
          <div className="enterCode center">
            <p className="label">Ingresa el codigo</p>
            <input className="input" type="text" name="partyCode" placeholder="" onChange={this.updatePartyCode} />
          </div>
          <Button text="Unirse a la sala" className="center" disabled={this.state.partyCode.length === 0} link={`/join/${this.state.partyCode}`} />
          <Footer>
          Siguenos en <a href="https://instagram.com/juegamalaleche"> Instagram!</a><br/>
          Powered By  <a href="https://www.linkedin.com/in/manuel-alba-689619171/"> elmalba!</a>

          </Footer>
        </Bottom>
      </Screen>
    );
  }
}

export default JoinPartyScreen;
