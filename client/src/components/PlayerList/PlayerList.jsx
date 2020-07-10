import React,{Component} from 'react'
import "./PlayerList.css"
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../../firebase';



class UserName extends Component {
  render() {
    const {
      user,
      signInWithGoogle,
      signOut,
    } = this.props;

    if (user){
      this.props.change(user.displayName.split(" ")[0])
    }
    console.log("USER",user)
    
    return (
      <div>
          {
            user
              ?user.displayName
              : <div className="col s12 m6 offset-m3 center-align">
              <button  className="oauth-container btn darken-4 white black-text" onClick={signInWithGoogle} style={{textTransform: 'none'}}>
                <div className="left">
                  <img width="20px" style={{marginTop: '7px', marginRight: '8px'}} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                </div>
                Ingresar con Google
              </button>
            </div>
          }
          {user?<div className="col s12 m6 offset-m3 center-align">
              <button  className="oauth-container btn darken-4 white black-text" onClick={signOut} style={{textTransform: 'none'}}>
                <div className="left">
                  <img width="20px" style={{marginTop: '7px', marginRight: '8px'}} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                </div>
                Cerrar sesión
              </button>
            </div>
          :null}
      </div>
    );
  }
}

const firebaseAppAuth = firebaseConfig.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

let Name = withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(UserName)

function PlayerList(props) {
  // const {
  //   user,
  //   signOut,
  //   signInWithGoogle,
  // } = this.props;
  return (
    <div className={`${props.className}`}>
      <ol>

        { props.players.map(((player,index) => <li key={index}>{player}</li>)) }
        { !props.joined && <Name  change={props.onChange} /> }  


        {/* { !props.joined && <li><input type="text" className="enterName" placeholder="Ingresa tu nombre" id="playerName" onChange={props.onChange}/></li>} */}
      </ol>
    </div>
  )
}




export default PlayerList;
