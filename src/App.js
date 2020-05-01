import React from 'react';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Cookies from 'universal-cookie';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Album from './views/Menu'
import Register from './views/Register'
import Login from './views/Login'

function App() {
  return (
    <AlertProvider template={AlertTemplate}>
      <Router>
        <Switch>
          <NotLoggedRoute path="/login">
            <Login />
          </NotLoggedRoute>
          <NotLoggedRoute path="/register">
            <Register />
          </NotLoggedRoute>
          <Route path="/">
            <Album />
          </Route>
        </Switch>
      </Router>
    </AlertProvider>
  );
}

function NotLoggedRoute({ children, ...rest }) {
  const cookies = new Cookies();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        typeof cookies.get('user') == "undefined" ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
