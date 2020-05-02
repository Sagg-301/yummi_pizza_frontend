import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Grid from "@material-ui/core/Grid";
import { fade, makeStyles } from '@material-ui/core/styles';
import { useAlert } from 'react-alert'
import Cookies from 'universal-cookie';
import TopMenu from "../components/TopMenu";
import axios from "axios";
import uri from "../helpers/system_variables";
import {
    useParams
  } from "react-router-dom";

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
    listItem: {
    padding: theme.spacing(1, 0),
    },
    total: {
    fontWeight: 700,
    },
    title: {
    marginTop: theme.spacing(2),
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
        },
    },
  }));


/**
 * Component Menu of Items
 */
export default function Receipt() {
  const classes = useStyles();
  const {id} = useParams()
  const [order,setOrder] = useState({'order':{'items':[]}, 'total':0})
  const alert = useAlert();
  const cookies = new Cookies()

  useEffect(()=>{
    axios.get(`${uri}/order/get/${id}`).then(function(response){
        setOrder({'order': response.data.order, 'total': response.data.total})
    })
  },[])
  
  return (
    <React.Fragment>
      <CssBaseline />
      <TopMenu></TopMenu>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
                Order #{id} summary
            </Typography>
            <List disablePadding>
                {order.order.items.map((item) => (
                <ListItem className={classes.listItem} key={item.name}>
                    <ListItemText primary={item.name} />
                    <Typography variant="body2">Price {order.order.currency_id == 1 ? '$':'€'}{item.pivot.price * (order.order.currency_id == 1 ? 1 :1.5)}</Typography>
                    <Typography style={{ paddingLeft:"5px" }} variant="body2"> X {item.pivot.quantity}</Typography>
                </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Delivery" />
                    <Typography variant="body2">Price {order.order.currency_id == 1 ? '$':'€'}{5 * (order.order.currency_id == 1 ? 1 :1.5)}</Typography>
                </ListItem>
                <ListItem className={classes.listItem}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" className={classes.total}>
                    {order.order.currency_id == 1 ? '$':'€'}{(order.total + order.order.delivery_rate) * (order.order.currency_id == 1 ? 1 :1.5)}
                </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom className={classes.title}>
                    Shipping
                </Typography>
                <Typography gutterBottom>{order.order.name}</Typography>
                <Typography gutterBottom>{order.order.address}</Typography>
                <Typography gutterBottom>{order.order.phone_number}</Typography>
                </Grid>
            </Grid>
        </Paper>
        </main>
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