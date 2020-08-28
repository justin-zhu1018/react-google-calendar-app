import React, {Component} from 'react';
import {CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES} from './config.json';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: '',
      name: '',
    };
  }
  componentDidMount() {
    console.log('Poggers');
    var auth_button = document.getElementById('authorize_button');
    // auth_button.style = {display: 'block'};
    auth_button.style.display = 'block';
  }

  handleSignIn = async () => {
    var authorizeButton = document.getElementById('authorize_button');
    var gapi = await window.gapi;
    gapi.load('auth2', () => {
      let auth2 = gapi.auth2.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      if (this.state.signedIn === '') {
        let signedIn = auth2.isSignedIn.get();
        this.setState({signedIn});
      }
      // this.consoleLogState();
      // console.log(auth2.isSignedIn.get());

      if (this.state.signedIn === false) {
        Promise.resolve(
          auth2.signIn().then(
            (val) => {
              console.log('Signed in?', val);
              this.setState({name: val.rt.Ad});
              console.log(val.rt.Ad);
              this.postSignIn();
            },
            (error) => {
              this.setState({signedIn: false});
              console.log('error, popup closed');
            }
          )
        );
      }
      // auth2.isSignedIn.listen(this.postSignIn);

      // .then((authResult) => {
      //   var auth2 = gapi.auth2.getAuthInstance();
      //   auth2.isSignedIn.listen(this.postSignIn());
      //   auth2.signIn();
      //   auth2.isSignedIn.listen(this.postSignIn());
      // });
    });
  };

  handleSignOut = () => {
    // window.gapi.signOut();
    console.log('signOut');
    // var gapi = window.gapi;
    window.gapi.auth2
      .getAuthInstance()
      .signOut()
      .then(function () {
        console.log(
          'After sign out',
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
        document.getElementById('authorize_button').style.display = 'block';
        document.getElementById('signOut_button').style.display = 'none';
      });
    this.setState({name: ''});
  };

  consoleLogState = () => {
    console.log(this.state.signedIn);
  };

  postSignIn = () => {
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signOut_button').style.display = 'block';
  };

  authorize = (gapi) => {
    gapi.auth2.init({}).then(function () {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.isSignedIn.listen(postSignIn);
      auth2.signIn();

      var postSignIn = function (val) {
        console.log('signed in');
        gapi.client.load('calendar', 'v3', () => {
          console.log('calendar');
        });
      };

      // this.updateSigninStatus(gapi.auth2.getAuthInstance.isSignedIn.get());
    });

    // gapi.auth2.getAuthInstance().signIn().then(this.updateSignInButtons());
  };
  updateSignInButtons = () => {
    console.log('SignIn Buttons!');
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signOut_button').style.display = 'block';
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Hello World</h1>
          <h2>Name: {this.state.name}</h2>
          <button
            id="authorize_button"
            onClick={this.handleSignIn}
            style={{display: 'none'}}
          >
            Sign in
          </button>
          <button
            id="signOut_button"
            onClick={this.handleSignOut}
            style={{display: 'none'}}
          >
            Sign Out
          </button>
        </header>
      </div>
    );
  }
}
