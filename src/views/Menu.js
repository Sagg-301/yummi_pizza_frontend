import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Backdrop from '@material-ui/core/Backdrop';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Link from '@material-ui/core/Link';
import Cookies from 'universal-cookie';
import TopMenu from "../components/TopMenu";
import axios from "axios";
import uri from "../helpers/system_variables";
import { useAlert } from 'react-alert'

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
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  circularLoad:{
    display: 'flex',
    '& > * + *': {
      marginLeft: 'theme.spacing(2)',
    },
  },
  itemQuantity:{
    width:"25%",
  },
  addToCartButton:{
    marginLeft: 'auto !important'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));


/**
 * Component Menu of Items
 */
export default function Album() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const cookies = new Cookies();
  const alert = useAlert();

  /**
   * Add to cart in cookies
   * @param {*} cart 
   * @param {*} id 
   * @param {*} quantity 
   */
  function addToCartInCookies(cart, id, price, quantity, url){

    if(typeof cart == "undefined" ){
      cookies.set('shopping_cart',[]);
      cart = [];
    }

    for (let i = 0; i < cart.length; i++) {
      const element = cart[i];
      if (element.id == id){
        cart.splice(i,1);
      }
    }

    cart.push({'id': id, 'quantity': quantity, 'price': price, 'image_url': url})
    cookies.set('shopping_cart',cart);
    console.log(cart)
  }

  /**
   * Add to cart in databse
   * @param {*} id 
   * @param {*} quantity 
   */
  function addToCart(user, id, quantity){
    axios.post(`${uri}/cart/store`,{
      items: [{'id':id, 'quantity':quantity}]
    }, {headers: { 'Authorization': `${user.token_type} ${user.access_token}`}})
    .then(function(response){
      console.log(response)
    })
    .catch(function(response){
      console.log(response)
    })
  }

  /**
   * Add item to cart event
   * @param {*} id 
   * @param {*} quantity 
   */
  function handleAddToCart(event, id, price, url) {
    console.log(event.target);
    var cart = cookies.get('shopping_cart');
    var user = cookies.get('user');
    var quantity = document.getElementById("quantity_input_"+id).value

    if(user == undefined){
      addToCartInCookies(cart,id,price, quantity, url)
    }
    else{
      addToCart(user, id, quantity);
    }

    alert.show("Item added to cart", {
      timeout:2000,
      type: 'success',
    })
  }


  /**
   * Use Effect Hook
   */
  useEffect(() => {
    var cookies = new Cookies()
    console.log(cookies.get('user'));
    axios.get(`${uri}/item/all`).then(function(response){
      setItems(response.data.items)
    })
    .catch(function(response){
      //code here
    })
    
  },[]);

  function checkIfLessThanZero(event) {
    if (event.target.value < 1){
      event.target.value = 1;
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <TopMenu></TopMenu>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Yummi Pizza
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              In Yummi Pizza we serve you the best Pizza you'll ever have!
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {items.length == 0 ? <Backdrop className={classes.backdrop} open={true}>
                                    <CircularProgress color="inherit" />
                                  </Backdrop>  : 
                items.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={item.image_url}
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <form></form>
                      <Typography gutterBottom variant="h5" component="h2">
                      {item.name}{item.type == 'pizza' ? ' Pizza' : ''}
                      </Typography>
                      <Typography>
                        {item.description}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Price: {item.price * 1}$
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <TextField
                        id={"quantity_input_"+item.id}
                        defaultValue = {1}
                        label="Quantity"
                        type="number"
                        className={classes.itemQuantity}
                        onChange = {(e)=>checkIfLessThanZero(e)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <IconButton className={classes.addToCartButton} id={"add-to-cart-"+item.id} aria-label="Add to shoping cart" color="inherit" onClick={(e)=>handleAddToCart(e, item.id, item.price, item.image_url)}>
                          <AddShoppingCartIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
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