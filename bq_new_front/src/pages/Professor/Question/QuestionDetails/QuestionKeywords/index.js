import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField,
    Grid, Tooltip, Chip, IconButton, DialogTitle, Dialog, DialogContent,
    DialogContentText, Button, DialogActions
} from "@material-ui/core";
import api from "../../../../../services/api";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import Swal from "sweetalert2";
import Autocomplete from '@material-ui/lab/Autocomplete';
import HighlightOff from '@material-ui/icons/HighlightOff';
import clsx from "clsx";
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    btRemove: {
        color: '#f44336',
        marginRight: 2
    },
    chip:{
        backgroundColor: '#448aff',
        color: '#ffebee',
    },

});



const QuestionKeywords = props => {
    const { className, idQuestion, history, ...rest } = props;
    const [keywordsAll, setKeywordsAll] = useState([]);
    const [keywordsQuestion, setKeywordsQuestion] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [keyWordNew, setKeyWordNew] = React.useState('');

    const classes = useStyles();

    //configuration alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    function loadAlert(icon, message) {
        Toast.fire({
            icon: icon,
            title: message
        });
    }

    async function loadKeywordsAll(){
        try {
            const response = await api.get('all/keywords/');
            if(response.status === 200){
                setKeywordsAll(response.data);
            }
        } catch (error) {
        }
    }

    async function loadKeywordsQuestion(){
        try {
            const response = await api.get('question/keyword/'+idQuestion);
            if(response.status === 200){
                setKeywordsQuestion(response.data);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        loadKeywordsAll();
        loadKeywordsQuestion();
    }, []);

    async function addKeyWord(value){
        try {
            const fk_question_id = idQuestion;
            const keyword = value;
            const data = {
                fk_question_id, keyword
            }

            const response = await api.post('question/keyword', data);
            console.log('response', data, response);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else if(response.status === 200){
                loadKeywordsQuestion();
                loadKeywordsAll();
                loadAlert('success', 'Palavra-chave '+value+', cadastrada.');
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão');
        }
    }

    async function deleteKeyword(value){
        try {
            let url = 'question/keyword/'+value+'?fk_question_id='+idQuestion;
            console.log(url);

            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else if(response.status === 200){
                loadKeywordsQuestion();
                loadKeywordsAll();
                loadAlert('success', 'Palavra-chave excluida.');
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão');
        }
    }

    const selectKeyWord = (event, newValue) => {
        if(newValue!=null){
            addKeyWord(newValue.keyword);
        }
    }

    const onClickDeleteKeyword = (id) => {
        deleteKeyword(id);
    }

    const handleClickOpen = () => {
        setOpen(true);
        setKeyWordNew('');
    };

    const handleClose = () => {
        setOpen(false);
        setKeyWordNew('')
    };

    const handleSaveKeyword = () => {
        setOpen(false);
        addKeyWord(keyWordNew);
    };

    const handleChangeKeyword = (event) => {
        setKeyWordNew(event.target.value);
    };


    return (
       <div>

           <div style={{marginTop: "10px"}}>
               <Grid
                   container
                   direction="row"
                   justify="flex-star"
                   alignItems="flex-start">
                   <Tooltip placement="top" title="Selecione a palavra-chave que deseja adicionar. Caso NÃO encontre nesta listagem, clique no ícone ao lado para adicionar33.">
                       <Autocomplete
                           autoSelect={true}
                           style={{marginTop: '100px'}}
                           id="keywords"
                           options={keywordsAll}
                           getOptionLabel={(option) => option.keyword}
                           onChange={(event, newValue) => selectKeyWord(event, newValue)}
                           style={{ width: 300 }}
                           renderInput={(params) =>
                               <TextField {...params} label="Palavra-chave" variant="outlined" />}
                       />
                   </Tooltip>
                   <Tooltip title="Adicionar uma palavra chave." aria-label="add" style={{marginLeft: '8px'}}>
                       <IconButton aria-label="delete"
                                   onClick={handleClickOpen}>
                           <AddIcon />
                       </IconButton>
                   </Tooltip>
               </Grid>
           </div>
           <Grid
               container
               direction="row"
               justify="flex-star"
               alignItems="flex-start" style={{marginTop: '20px'}}>
               {keywordsQuestion.map((row) => (
                   <div style={{marginRight: '7px', marginTop: '7px'}}>
                           <Chip
                               label={row.keyword}
                               clickable
                               color="secondary"
                               onDelete={() => deleteKeyword(row.id)}
                               deleteIcon={<HighlightOff     />}
                               className={clsx(classes.chip, className)}/>
                   </div>
               ))}
           </Grid>
           <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">Palavra-chave</DialogTitle>
               <DialogContent>
                   <DialogContentText>
                      Informe a a palavra chave que deseja adicionar a sua questão.
                   </DialogContentText>
                   <TextField
                       autoFocus
                       margin="dense"
                       value={keyWordNew}
                       onChange={handleChangeKeyword}
                       id="name"
                       label="Palavra-chave"
                       fullWidth
                   />
               </DialogContent>
               <DialogActions>
                   <Button onClick={handleClose} color="primary">
                       Cancelar
                   </Button>
                   <Button onClick={handleSaveKeyword} color="primary">
                       Salvar
                   </Button>
               </DialogActions>
           </Dialog>
       </div>

    );
}

QuestionKeywords.propTypes = {
    className: PropTypes.string,
    idQuestion: PropTypes.number,
};

export default withRouter(QuestionKeywords);
