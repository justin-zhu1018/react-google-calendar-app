import React, {Component} from 'react';
import {CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES} from './config.json';
import './App.css';

// LINKS: https://developers.google.com/calendar/quickstart/js
// https://developers.google.com/identity/sign-in/web/listeners

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isSignedIn: null,
    };
  }
  componentDidMount() {
    window.gapi.load('client:auth2', () => {
      this.initializeGapi();
    });
  }

  initializeGapi = () => {
    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOCS],
        scope: SCOPES,
      })
      .then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();
        console.log('Auth: ', this.auth.isSignedIn.get());
        console.log('Profile: ', this.auth.currentUser.get());

        this.handleAuthChange();
        this.auth.isSignedIn.listen(this.handleAuthChange);
      });
  };

  handleAuthChange = () => {
    if (this.auth.isSignedIn.get()) {
      this.setState({name: this.auth.currentUser.get().rt.Ad});
      document.getElementById('name-div').style.display = 'block';
    }
    this.setState({isSignedIn: this.auth.isSignedIn.get()});
  };

  handleAddEvent = () => {
    console.log('Add event!');
    var event = {
      summary: 'Google I/O 2015',
      location: '800 Howard St., San Francisco, CA 94103',
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: '2020-08-28T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2020-08-28T17:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
      attendees: [
        // {email: 'lpage@example.com'}, {email: 'sbrin@example.com'}
      ],
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60},
          {method: 'popup', minutes: 10},
        ],
      },
    };

    var request = window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    request.execute((event) => {
      // console.log(event.htmlLink);
      window.open(event.htmlLink);
    });
  };

  renderAuthButton() {
    if (this.state.isSignedIn === null) {
      return null;
    } else if (this.state.isSignedIn) {
      return (
        <div>
          <button onClick={this.handleAddEvent}>Add Event</button>
          <button onClick={this.handleSignOut}>Sign Out</button>
        </div>
      );
    } else {
      return <button onClick={this.handleSignIn}>Sign In</button>;
    }
  }

  handleSignOut = () => {
    this.auth.signOut();
    this.setState({name: ''});
  };

  handleSignIn = () => {
    this.auth.signIn();
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Event Adder</h1>
          <div id="name-div" style={{display: 'block'}}>
            {' '}
            <h2> {this.state.name}</h2>
          </div>

          <div>{this.renderAuthButton()}</div>
        </header>
      </div>
    );
  }
}
