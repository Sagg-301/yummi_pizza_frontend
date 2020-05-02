import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { fade, makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useAlert } from 'react-alert'
import Cookies from 'universal-cookie';
import TopMenu from "../components/TopMenu";
import axios from "axios";
import uri from "../helpers/system_variables";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));


/**
 * Component Menu of Items
 */
export default function Album() {
  const classes = useStyles();
  const alert = useAlert();
  const cookies = new Cookies()

  /**
   * Add the items saved in cookies to cart
   */
  function addItemsFromCookiesToCart(user){
    var cart = cookies.get('shopping_cart');
    if (typeof cart != 'undefined'){
        axios.post(`${uri}/cart/store`,{items: cart},{headers: { 'Authorization': `${user.token_type} ${user.access_token}`}})
        .then(function(response){
            cookies.remove('shopping_cart');
        })
        .catch(function(response){

        })
    }
  }

  /**
   * Handle the Login Logic
   */
  function handleLogin(){
      var data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        remember_me: document.getElementById('remember').value,
      };

      console.log(data);
      axios.post(`${uri}/auth/login`,data).then(function(response){
        if (response.data.success) {
            var user = {
                access_token: response.data.access_token,
                expires_at: response.data.expires_at,
                token_type: response.data.token_type,
                user_id: response.data.response.user.id,
                name: response.data.response.user.name,
                email: response.data.response.user.email,
            }
            cookies.set('user', user, {expires: new Date(user.expires_at)})

            //If there are items on the shopping cart
            addItemsFromCookiesToCart(user);
            
            alert.show(response.data.response.message, {
                timeout:2000,
                type: 'success',
                onClose: () => {
                    window.location.href='/';
                  }
              })
        }
        else{
            
            alert.show("All fields are required", {
                timeout:2000,
                type: 'error',
            })
        }
      }).catch(function(response){
        console.log(response);
        alert.show("error", {
            type: 'success',
        })
      });
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <TopMenu></TopMenu>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Log in
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={<Checkbox value="remember" id="remember" color="primary" />}
                            label="Remember me"
                        />
                    </Grid>
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e)=>handleLogin()}
                >
                    Log in
                </Button>
            </form>
        </div>
      </Container>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}