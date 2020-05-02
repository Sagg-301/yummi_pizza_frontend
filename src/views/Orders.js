import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from "@material-ui/core/Container";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import { fade, makeStyles } from '@material-ui/core/styles';
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
export default function OrderList() {
const classes = useStyles();
const [orders,setOrders] = useState([]);
const cookies = new Cookies()

    useEffect(() => {
        var user = cookies.get('user');
            
        axios.get(`${uri}/order/all`,{headers: { 'Authorization': `${user.token_type} ${user.access_token}`}}).then(function(response){
            console.log(response.data.items)
                setOrders(response.data)
                console.log(response)
            })
            .catch(function(response){
            //code here
            })
        
    },[]);


return (
    <React.Fragment>
    <CssBaseline />
    <TopMenu></TopMenu>
    <Container component="main">
        <div className={classes.paper}>
            
            <Typography variant="h3">
                Orders
            </Typography>
            <List className={classes.list}>
                {orders.map((order)=>(
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography className={classes.heading}> Order #{order.order.id} summary</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <main className={classes.layout}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom>
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
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    ))}
            </List>
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