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
    TextField, Button, TableCell, DialogTitle, DialogContent, DialogActions, Paper, Box, Link
} from '@material-ui/core';
import { MoreVert, Edit } from '@material-ui/icons';
import moment from 'moment';
import api from "../../../../services/api";
import { toast } from 'react-toastify';
import {withRouter} from "react-router-dom";
import {DialogQuestione} from "../../../../components";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useStyles from "../../../../style/style";

const useStylesLocal = makeStyles(() => ({
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

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
        <Paper className={evaluation.status == 2 ? classesGeneral.paperTitleGray : classesGeneral.paperTitle}>
            <Box display="flex">
                <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                    <div className={classesGeneral.paperTitleText}>
                        {evaluation.id < 10 ? '00000' + evaluation.id :
                            evaluation.id < 100 ? '0000' + evaluation.id :
                                evaluation.id < 1000 ? '000' + evaluation.id :
                                    evaluation.id < 10000 ? '00' + evaluation.id :
                                        evaluation.id < 100000 ? '0' + evaluation.id :
                                            evaluation.id}
                    </div>
                    <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '15px'}}>
                        {evaluation.description}
                    </div>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    { evaluation.status == 1 ?
                        <Tooltip title="Editar Avaliação">
                            <IconButton
                                aria-label="copy"
                                onClick={onEdit}
                                size="small">
                                <Edit />
                            </IconButton>
                        </Tooltip> : null }
                    <Tooltip title="Opções da Avaliação">
                        <IconButton
                            aria-label="settings"
                            onClick={handleClick}
                            size="small">
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Paper>
        <CardContent>
            <Tooltip title="Clique para visualizar as questões." placement="left-end">
                <Link onClick={() => history.push(`/evaluation-questions/${evaluation.id}`)}>
                    {evaluation.questions.length == 0 ?
                        <div className={classesGeneral.paperTitleText} style={{color: '#f44336'}}>
                            {'Esta avaliação possui '+evaluation.questions.length+' questões.'}
                        </div> :
                            <div className={classesGeneral.paperTitleText}>
                                {'Esta avaliação possui '+evaluation.questions.length+' questões.'}
                            </div>}
                </Link>
            </Tooltip>
          <div className={classesGeneral.paperTitleText}>
              {'Esta avaliação foi criada em: '+ moment(evaluation.created_at).format('DD/MM/YYYY')+'.'}
          </div>

          { evaluation.status == 2 &&
              <div className={classesGeneral.textRedInfo} style={{marginTop: '10px'}}>
                  {'Arquivada'}
              </div> }
        </CardContent>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            {/* evaluation.status == 1 ? <MenuItem onClick={handleNewApplication}>Novo Simulado</MenuItem> : null*/}
            {/*<MenuItem onClick={() => history.push(`/evaluation-questions/${evaluation.id}`)}>Ver questões</MenuItem>*/}
            <MenuItem onClick={duplicate}><div className={classesGeneral.itensMenu}>{'Duplicar'}</div></MenuItem>
            { evaluation.status == 1 ? <MenuItem onClick={() => changeStatus(2) }><div className={classesGeneral.itensMenu}>{'Arquivar'}</div></MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={() => changeStatus(1) }><div className={classesGeneral.itensMenu}>{'Ativar'}</div></MenuItem> : null}
            { evaluation.status == 2 ? <MenuItem onClick={onClickOpenDialog}><div className={classesGeneral.itensMenu}>{'Deletar'}</div></MenuItem> : null}
        </Menu>
        <DialogQuestione handleClose={onClickCloseDialog}
                         open={open}
                         onClickAgree={onDelete}
                         onClickDisagree={onClickCloseDialog}
                         mesage={
                                <div className={classesGeneral.messageDialog}>
                                {'Deseja excluir a avaliação '+evaluation.description+'?'}
                            </div>}
                         title={
                             <div className={classesGeneral.titleDialog}>
                                 {'Excluir Avaliação'}
                             </div>}/>
        {/* Dialog de cadastro de aplicação */}
        <Dialog fullScreen={fullScreen}
                onClose={handleNewApplicationExit}
                aria-labelledby="responsive-dialog-title" open={openNewApplication}>
            <DialogTitle id="responsive-dialog-title">{"Cadastrar novo simulado"}</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="outlined"
                    className={classes.fieldsDialog}
                    onClick={saveNewApplication}>
                    Salvar
                </Button>
            </DialogActions>
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
