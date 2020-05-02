import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function PlaceOrderDialog(props) {

    const [open,setOpen] = useState(props.open);

    const handleClose = ()=>{
        setOpen(false);
        console.log(open)
    }

    return (
        <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To finish placing your order, please finish the form below.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Full Name"
                type="text"
                fullWidth
            />
            <TextField
                autoFocus
                margin="dense"
                id="phone"
                label="Phone Number"
                type="text"
                fullWidth
                />
            <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Address"
                type="text"
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
                Place Order
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}