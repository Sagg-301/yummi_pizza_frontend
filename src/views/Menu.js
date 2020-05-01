import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
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
      marginLeft: theme.spacing(2),
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
}));


/**
 * Component Menu of Items
 */
export default function Album() {
  const classes = useStyles();

  //State
  const [items, setItems] = useState([]);

  /**
   * Add item to cart event
   * @param {*} id 
   * @param {*} quantity 
   */
  function handleAddToCart(id) {
    var cookies = new Cookies();
    var cart = cookies.get('shopping_cart');

    var quantity = document.getElementById("quantity_input_"+id).value

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

    cart.push({'id': id, 'quantity': quantity})
    cookies.set('shopping_cart',cart);
    console.log(cart)
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
              {items.length == 0 ? <CircularProgress lassName={classes.circularLoad}/> : items.map((item) => (
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
                        label="Quantity"
                        type="number"
                        className={classes.itemQuantity}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <IconButton className={classes.addToCartButton} aria-label="Add to shoping cart" color="inherit" onClick={(e)=>handleAddToCart(item.id)}>
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