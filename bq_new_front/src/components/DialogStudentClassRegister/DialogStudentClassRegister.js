import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import {Button} from "@material-ui/core";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";

const DialogStudentClassRegister = props => {
    const { open, handleClose, onClickRegister, registerLoading } = props;

    const [studentClassCode, setStudentClassCode] = React.useState('');

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Participar de uma turma</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Digite o código da turma para inscrever-se
                    </DialogContentText>
                    <TextField
                        label="Código da turma"
                        margin="dense"
                        onChange={(event) => setStudentClassCode(event.target.value)}
                        value={studentClassCode}
                        style={{ width: '100%' }}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClickRegister(studentClassCode)} color="primary" disabled={registerLoading}>
                        {registerLoading ? 'Inscrevendo-se' : 'Inscrever-se'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
  );
}

DialogStudentClassRegister.propTypes = {
    handleClose: PropTypes.func,
    open: PropTypes.object,
    onClickAgree: PropTypes.func,
    onClickDisagree: PropTypes.func,
    mesage: PropTypes.string,
    title: PropTypes.string,
};

export default DialogStudentClassRegister;