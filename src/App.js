
import './App.css';
import React, { Component } from 'react'
import Routes from "./routes";
import {theme} from "./theme";
import {ThemeProvider} from '@material-ui/core/styles';
import firebase from 'firebase';
export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
        initializing:true
    }

}

initFireBase=()=>{
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyC5DzOA2GZkIJ5ociXMgYGgTFc6Cao1cz0",
      authDomain: "react-55176.firebaseapp.com",
      projectId: "react-55176",
      storageBucket: "react-55176.appspot.com",
      messagingSenderId: "749166437571",
      appId: "1:749166437571:web:144660f5af3f754947ee76",
      measurementId: "G-PHVW8MZPGL"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    this.setState({
        initializing:false
    })
};
componentDidMount() {
    this.initFireBase();
}
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Routes/>
        </ThemeProvider>
      </div>
    )
  }
}

