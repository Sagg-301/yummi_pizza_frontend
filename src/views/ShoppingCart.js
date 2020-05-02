import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DeleteIcon from '@material-ui/icons/Delete';
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
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column',
      width: '90%',
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
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
    inline: {
    display: 'inline',
    },
    itemQuantity:{
      width:"50%",
      paddingLeft:"auto"
    },
    total:{
      paddingLeft:"auto"
    },
    section2: {
      margin: theme.spacing(2),
    },
    section3: {
      margin: theme.spacing(3, 1, 1),
    },
  }));


/**
 * Component Menu of Items
 */
export default function Album() {
  const classes = useStyles();
  const alert = useAlert();
  const [cart,setCart] = useState([]);
  const [total,setTotal] = useState(0);
  const [rate,setRate] = useState(1);
  const cookies = new Cookies()

    useEffect(() => {
        var user = cookies.get('user');
        var cart = cookies.get('shopping_cart');
        var total_var = 0

        if (typeof user != "undefined"){
            
        axios.get(`${uri}/cart/show`,{headers: { 'Authorization': `${user.token_type} ${user.access_token}`}}).then(function(response){
                
                for (let i = 0; i < response.data.items.length; i++) {
                    const element = response.data.items[i];
                    total_var += element.price * element.pivot.quantity
                }
                setTotal(total_var)
                setCart(response.data.items)
            })
            .catch(function(response){
            //code here
            })
        }
        else{
            if(typeof cart != "undefined"){
                for (let i = 0; i < cart.length; i++) {
                    const element = cart[i];
                    total_var += element.price * element.quantity
                }
                setTotal(total_var)
                setCart(cookies.get('shopping_cart'))
            }
            else{
                cookies.set('shopping_cart',[]);
            }
        }
        
    },[]);

  function handleChange(event){
      var value = event.target.value;
      var doms = document.getElementsByClassName('currency');
      console.log(value)
        if(value == 1){
            setRate(1);
            for (let i = 0; i < doms.length; i++) {
                const element = doms[i];
                element.innerHTML = "$";
            }
        }

        if(value == 2){
            setRate(1.5);
            for (let i = 0; i < doms.length; i++) {
                const element = doms[i];
                element.innerHTML = "€";
            }
        }
  }

  function handleDelete(event, id, price, quantity){
    var user = cookies.get('user');
    var cart = cookies.get('shopping_cart');
    var total_var = total;
    console.log(price * quantity);

    if (typeof user != "undefined"){
        axios.delete(`${uri}/cart/remove_item/${id}`,{headers: { 'Authorization': `${user.token_type} ${user.access_token}`}}).then()
            .catch(function(response){
            })
        }
        else{
            if(typeof cart != "undefined"){
                for (let i = 0; i < cart.length; i++) {
                    const element = cart[i];
                    if (element.id == id){
                        cart.splice(i,1);
                        console.log(cart);
                    }
                }
            }

            cookies.set('shopping_cart',cart)
        }

        setTotal(total_var - (price * quantity))
        document.getElementById('item-'+id).remove();
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <TopMenu></TopMenu>
      <Container component="main">
        <div className={classes.paper}>
            
            <Typography variant="h3">
                Shopping Cart
            </Typography>
            <List className={classes.list}>
                {cart.map((item)=>(
                    <div id={"item-"+item.id}>
                        <ListItem alignItems="flex-start" >
                            <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={item.image_url} />
                            </ListItemAvatar>
                            <ListItemText
                            primary={item.name}
                            secondary={
                                <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="body"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {item.price * rate}<a class="currency">$</a>
                                </Typography>
                                </React.Fragment>
                            }
                            />
                            <ListItemSecondaryAction>
                                <TextField
                                        id={"quantity_input_"+item.id}
                                        labelId="quantity_label"
                                        label="Quantity"
                                        type="number"
                                        disabled
                                        defaultValue={item.pivot ? item.pivot.quantity : item.quantity}
                                        className={classes.itemQuantity}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={(e)=>handleDelete(e, item.id, item.price, item.pivot ? item.pivot.quantity : item.quantity)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                    ))}
                    <Divider variant="middle" />
                    <div className={classes.section2}>
                        <Typography gutterBottom variant="body1">
                        Select Currency
                        </Typography>
                        <div>
                            <Select
                            labelId="demo-simple-select-helper-label"
                            id="currency-select"
                            onChange={handleChange}
                            defaultValue ={1}
                            >
                                <MenuItem value={1}>$</MenuItem>
                                <MenuItem value={2}>€</MenuItem>
                            </Select>
                            <FormHelperText>Select your currency</FormHelperText>
                            <Typography className={classes.total} variant="h6">
                                Delivery: {5 * rate}<a class="currency">$</a>
                            </Typography>        
                            <Typography className={classes.total} variant="h5">
                                Total: {(total+5) * rate}<a class="currency">$</a>
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.section3}>
                        <Button color="primary">Place Order</Button>
                    </div>
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