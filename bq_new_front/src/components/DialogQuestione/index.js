import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {Button, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";

const DialogQuestione = props => {
    const { className, open, handleClose, mesage, title,onClickAgree, onClickDisagree,...rest } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{
                    <Typography variant="subtitle1" color="#000000" component="p">
                        {title}
                    </Typography>}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="subtitle1" color="#000000" component="p">
                            {mesage}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClickAgree} color="primary">
                        Sim
                    </Button>
                    <Button variant="outlined" onClick={onClickDisagree} color="primary" autoFocus>
                        Não
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
  );
}

DialogQuestione.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.object,
    onClickAgree: PropTypes.func,
    onClickDisagree: PropTypes.func,
    mesage: PropTypes.string,
    title: PropTypes.string,
};

export default DialogQuestione;
