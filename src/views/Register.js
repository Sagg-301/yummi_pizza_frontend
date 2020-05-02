import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
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
export default function Register() {
  const classes = useStyles();
  const alert = useAlert();

  function handleRegister(){
      var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value,
      };

      console.log(data);
      axios.post(`${uri}/auth/register`,data).then(function(response){
        if (response.data.success) {
            alert.show(response.data.response.message, {
                timeout:2000,
                type: 'success',
                onClose: function(){
                    window.location.href = '/';
                }
              })
        }
        else{
          for (const error in response.data.errors) {
              if (response.data.errors.hasOwnProperty(error)) {
                  const element = response.data.errors[error];
                  alert.show(element, {
                      timeout:2000,
                      type: 'error',
                  })
              }
          }
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
            Sign up
            </Typography>
            <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                    <TextField
                        autoComplete="fname"
                        name="name"
                        variant="outlined"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        autoFocus
                    />
                    </Grid>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password_confirmation"
                        label="Confirm Password"
                        type="password"
                        id="password_confirmation"
                    />
                    </Grid>
                </Grid>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={(e)=>handleRegister()}
                >
                    Sign Up
                </Button>
                <Grid container justify="flex-end">
                    <Grid item>
                    <Link href="#" variant="body2">
                        Already have an account? Sign in
                    </Link>
                    </Grid>
                </Grid>
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