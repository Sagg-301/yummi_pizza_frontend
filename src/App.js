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
import Album from './views/Menu';
import Register from './views/Register';
import Login from './views/Login';
import ShoppingCart from './views/ShoppingCart';
import Receipt from './views/Receipt';
import OrderList from './views/Orders';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#A82424',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#A82424',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#FFF',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider template={AlertTemplate}>
      <Router>
        <Switch>
          <NotLoggedRoute path="/login">
            <Login />
          </NotLoggedRoute>
          <NotLoggedRoute path="/register">
            <Register />
          </NotLoggedRoute>
          <Route path="/shopping_cart">
            <ShoppingCart />
          </Route>
          <Route path="/receipt/:id">
            <Receipt />
          </Route>
          <LoggedRoute path="/orders">
            <OrderList />
          </LoggedRoute>
          <Route path="/">
            <Album />
          </Route>
        </Switch>
      </Router>
    </AlertProvider>
    </ThemeProvider>
    
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

function LoggedRoute({ children, ...rest }) {
  const cookies = new Cookies();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        typeof cookies.get('user') != "undefined" ? (
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
