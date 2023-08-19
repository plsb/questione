import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    MenuItem,
    Menu, Tooltip, Chip, Dialog, AppBar, Toolbar,
    TextField, Button, TableCell
} from '@material-ui/core';
import { MoreVert, Edit } from '@material-ui/icons';
import moment from 'moment';
import api from "../../../../services/api";
import { toast } from 'react-toastify';
import {withRouter} from "react-router-dom";
import {DialogQuestione} from "../../../../components";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 8,
  },
    head: {
        paddingBottom: 0,
        paddingTop: 10
    },
    chip:{
      backgroundColor: '#e57373',
      color: '#ffebee',
    },
  spacer: {
    flexGrow: 1
  },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: 2,
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    fieldsDialog: {
      marginTop: 20
    }
}));

const EvaluationCard = props => {
  const { className, history, refresh, setRefresh, evaluation, setTabValue, ...rest } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [descriptionNewApplication, setDescriptionNewApplication] = React.useState('');

    //Inserir o campo de turma no cadastro da nova aplicação
  const [classProfessor, setClassProfessor] = useState([]);
  const [classProfessorSelect, setClassProfessorSelect] = useState([]);
  const [searchText, setSearchText] = useState([0]);

  const onChangeClassProfessor = (e) =>{
    //setClassProfessor(e.target.value);
    setClassProfessorSelect(e.target.value);
    setSearchText(e.target.value)
  }

  async function loadClassProfessor(){
    try {
      const response = await api.get('class/professor/classes-professor?status=1');
      setClassProfessor([{'id': '0','id_class' : '00', 'description': 'Selecione a turma'}, ...response.data]);

    } catch (error) {

    }
  }

  const classes = useStyles();

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  const onEdit = () => {
      history.push('/evaluation-details/'+evaluation.id);
  }

  async function duplicate(){
      try {
          const response = await api.post('evaluation/duplicate/'+evaluation.id);
          if (response.status === 200) {
              toast.success('Avaliação cadastrada(duplicada).');
              setRefresh(refresh+1);
              handleClose();
          } else {
              toast.error('Erro ao mduar o status da avaliação.');
          }

      } catch (error) {

      }
  }

  async function changeStatus(status) {
      try {
          const data = {
              status
          }
          const response = await api.put('evaluation/change-status/'+evaluation.id, data);
          if (response.status === 200) {
              if (status == 1){
                  toast.success('Avaliação ativa.');
              } else {
                  toast.success('Avaliação arquivada.');
              }
              setRefresh(refresh+1);
              handleClose();
          } else {
              toast.error('Erro ao mduar o status da avaliação.');
          }

      } catch (error) {

      }
  }

    const onClickOpenDialog = () => {
        setOpen(true);
    }

    const onClickCloseDialog = () => {
        setOpen(false);
    }

    async function onDelete(){
        try {
            let url = 'evaluation/'+evaluation.id;
            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Avaliação excluída.');
                setRefresh(refresh+1);
            }

            handleClose();
        } catch (error) {

        }
        setOpen(false);
    }

    async function saveNewApplication(){
        try {
            if(descriptionNewApplication.length < 5){
                setOpenNewApplication(false);
                toast.error('Informe uma descrição com no mínimo 05 caracteres');
                return ;
            }
            if(classProfessorSelect == 0){
                setOpenNewApplication(false);
                toast.error('Informe a turma para a aplicação');
                return ;
            }
            const fk_evaluation_id = evaluation.id;
            const description = descriptionNewApplication;
            const fk_class_id = classProfessorSelect;
            const data = {
                description, fk_evaluation_id, fk_class_id
            }
            const response = await api.post('evaluation/add-application', data);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
                setOpenNewApplication(false);
            } else {
                toast.success('Nova aplicação cadastrada.');
                setDescriptionNewApplication('');
                //window.redirect = history.push("/evaluations");
                //setTabValue(1);
                setOpenNewApplication(false);
            }

        } catch (error) {

        }
    }

    //dialog de nova aplicação
    const [openNewApplication, setOpenNewApplication] = React.useState(false);

    const handleNewApplication = () => {
        setOpenNewApplication(true);
    };

    const handleNewApplicationExit = () => {
        setOpenNewApplication(false);
    }

    const handleChangeDescriptionNewApplication = (e) => {
        setDescriptionNewApplication(e.target.value);
    }

    useEffect(() => {
        loadClassProfessor();
       
      }, []);



  return (
    <Card
      {...rest}
      className={classes.root}>
          <CardHeader
              className={classes.head}
              action={
                  <div>
                      { evaluation.status == 1 ?
                      <Tooltip title="Editar Avaliação">
                          <IconButton
                              aria-label="copy"
                              onClick={onEdit}>
                              <Edit />
                          </IconButton>
                      </Tooltip> : null }
                          <Tooltip title="Opções da Avaliação">
                          <IconButton
                                aria-label="settings"
                                onClick={handleClick}>
                              <MoreVert />
                            </IconButton>
                      </Tooltip>
                  </div>
              }

              title={
                  evaluation.id < 10 ? '00000' + evaluation.id :
                      evaluation.id < 100 ? '0000' + evaluation.id :
                          evaluation.id < 1000 ? '000' + evaluation.id :
                              evaluation.id < 10000 ? '00' + evaluation.id :
                                  evaluation.id < 100000 ? '0' + evaluation.id :
                                      evaluation.id
              }/>
      <CardContent>
        <Typography variant="h4" color="textSecondary" component="h2">
            {'Avaliação: '+evaluation.description}
        </Typography>
          <Typography color="textSecondary" variant="h6">
              {'Data de criação: '+ moment(evaluation.created_at).format('DD/MM/YYYY')}
          </Typography>
          { evaluation.status == 2 ?
              <Chip label="Arquivada" className={clsx(classes.chip, className)} size="small"/> : null}
      </CardContent>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            { evaluation.status == 1 ? <MenuItem onClick={handleNewApplication}>Novo Simulado</MenuItem> : null}
            <MenuItem onClick={() => history.push(`/evaluation-questions/${evaluation.id}`)}>Ver questões</MenuItem>
            <MenuItem onClick={duplicate}>Duplicar</MenuItem>
            { evaluation.status == 1 ? <MenuItem onClick={() => changeStatus(2) }>Arquivar</MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={() => changeStatus(1) }>Ativar</MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={onClickOpenDialog}>Deletar</MenuItem> : null}
        </Menu>
        <DialogQuestione handleClose={onClickCloseDialog}
                         open={open}
                         onClickAgree={onDelete}
                         onClickDisagree={onClickCloseDialog}
                         mesage={'Deseja excluir a avaliação selecionada?'}
                         title={'Excluir Avaliação'}/>
        {/* Dialog de cadastro de aplicação */}
        <Dialog fullScreen onClose={handleNewApplicationExit} aria-labelledby="simple-dialog-title" open={openNewApplication}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleNewApplicationExit} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        Informe a descrição e selecione a turma para o simulado
                    </Typography>
                </Toolbar>
            </AppBar>
            <TextField
                fullWidth
                label="Descrição"
                margin="dense"
                name="description"
                variant="outlined"
                onChange={handleChangeDescriptionNewApplication}
                value={descriptionNewApplication}
                className={classes.fieldsDialog}
            />
            <TextField className={classes.textField}
                    id="filled-select-class"
                    select
                    label="Turma"
                    value={searchText ? searchText : 0}
                    onChange={onChangeClassProfessor}
                    helperText=""
                    variant="outlined"
                    margin="dense"
                   style={{width: '300px'}}
                   >
                  {classProfessor.map((option) => (
                   
                        <MenuItem key={option.id} value={option.id}>               
                            {option.id_class+' - '+option.description}
                        </MenuItem>
                      
                  ))}
                </TextField>
            <Button
                color="primary"
                variant="outlined"
                className={classes.fieldsDialog}
                onClick={saveNewApplication}>
                Salvar
            </Button>

        </Dialog>
    </Card>
  );
};

EvaluationCard.propTypes = {
    className: PropTypes.string,
    evaluation: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number
};

export default withRouter(EvaluationCard);
