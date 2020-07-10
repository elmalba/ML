import * as firebase from 'firebase/app';

const config = {
    apiKey: "AIzaSyD7OlbFrBj_8_oQIcquwe1agKDAvZiGlkg",
    authDomain: "malaleche-84e7f.firebaseapp.com",
    databaseURL: "https://malaleche-84e7f.firebaseio.com",
    projectId: "malaleche-84e7f",
    storageBucket: "malaleche-84e7f.appspot.com",
    messagingSenderId: "476267625804",
    appId: "1:476267625804:web:bf88f6f0bb7fa4790763e9",
    measurementId: "G-KLBMB15XKH"
  }

const app = firebase.initializeApp(config);


export default app