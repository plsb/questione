import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    CardHeader,
    IconButton,
    MenuItem, Menu,
    CardContent,
    Typography,
    CardActions,
    Tooltip,
    Collapse,
    Paper,
    Chip,
    Switch, ListItem, ListItemText,
    ListItemAvatar,
    List,
    DialogTitle,
    Dialog, Avatar, AppBar, Toolbar
} from '@material-ui/core';
import {MoreVert, FavoriteRounded, PlaylistAdd, ExpandMoreRounded, Edit} from '@material-ui/icons';
import Swal from "sweetalert2";
import {withRouter} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from "../../services/api";
import {DialogQuestione} from "../index";
import AddIcon from '@material-ui/icons/Add';
import moment from "moment";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 8,
  },
    head: {
        paddingBottom: 0,
        paddingTop: 10
    },
    chipGreen:{
      backgroundColor: '#4db6ac',
      color: '#ffffff',
        marginRight: 2
    },
  spacer: {
    flexGrow: 1
  },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    paper: {
        display: 'flex',
        marginBottom: 10,
        '& > *': {
            margin: theme.spacing(2),
        },
    },
    paperWrong: {
        backgroundColor: '#ef9a9a',
        color: '#212121',
    },
    paperRight: {
        backgroundColor: '#80cbc4',
        color: '#212121',
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontWeight: 'bold',
        color: '#ffffff'
    },
}));

const QuestionCard = props => {
  const { className, history, question, id_evaluation, ...rest } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [openDeleteQuestionEvaluation, setOpenDeleteQuestionEvaluation] = React.useState(false);
    const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false);
    const [openEnableQuestion, setOpenEnableQuestion] = React.useState(false);
    const [evaluations, setEvaluations] = React.useState([]);

  const classes = useStyles();

    async function loadEvaluations(){
        try {
            let url = '/evaluation/choose';

            const response = await api.get(url);
            setEvaluations(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
            setEvaluations([]);
        }
    }

    useEffect(() => {
        loadEvaluations();
    }, []);

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

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClickOpenDialogQEvaluation = () => {
        setOpenDeleteQuestionEvaluation(true);
    }

    const onClickCloseDialogQEvaluation = () => {
        setOpenDeleteQuestionEvaluation(false);
    }

    const onClickOpenDialogQuestion = () => {
        setOpenDeleteQuestion(true);
    }

    const onClickCloseDialogQuestion = () => {
        setOpenDeleteQuestion(false);
    }

    const onClickOpenDialogEnableQuestion = () => {
        setOpenEnableQuestion(true);
    }

    const onClickCloseDialogEnableQuestion = () => {
        setOpenEnableQuestion(false);
    }

    async function deleteQuestion(){
        try {
            let url = 'question/'+question.id;

            console.log(url);
            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Questão excluída.');
                window.location.reload();
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
        setOpenDeleteQuestionEvaluation(false);
    }

    async function deleteQuestionEvaluation() {
        try {
            let url = 'evaluation/deletequestion/'+question.id+'+?fk_evaluation_id='+id_evaluation;
            const fk_evaluation_id = id_evaluation;
            const data = {
                fk_evaluation_id
            }
            console.log(url);
            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Questão excluída da avaliação.');
                window.location.reload();
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
        setOpenDeleteQuestionEvaluation(false);
    }

    const onApplyQuestionInEvaluation = () => {

    }

    async function handleChangeValidated() {
        if(question.validated == 1){
            loadAlert('error', 'Uma questão que já foi habilitada não pode ser desabilitada.');
            return ;
        }
        try {
            let url = 'question/validate/'+question.id;
            const response = await api.put(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Questão habilitada.');
                window.location.reload();
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
        setOpenEnableQuestion(false);
    }

    async function duplicateQuestion() {
        try {
            let url = 'question/duplicate/'+question.id;
            const response = await api.post(url);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Questão duplicada.');
                window.location.reload();
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }
    }

    const [openEvalationChoose, setOpenEvalationChoose] = React.useState(false);

    const handleChooseEvaluation = () => {
        setOpenEvalationChoose(true);
    };

    const handleChooseEvaluationExit = () => {
        setOpenEvalationChoose(false);
    }

    async function handleListItemClick (evaluation) {

        try {
            let url = '/evaluation/addquestion';
            const fk_question_id = question.id;
            const fk_evaluation_id = evaluation.id;
            const data = {
                fk_question_id, fk_evaluation_id
            }

            const response = await api.post(url, data);

            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                }
            } else {
                loadAlert('success', 'Questão adicionada na avaliação.');
            }
        } catch (error) {
            loadAlert('error', 'Erro de conexão.');
        }

        setOpenEvalationChoose(false);

        console.log(evaluation);
    };

  return (
    <Card
      {...rest}
      className={classes.root}>
        <CardHeader
            action={
                <div>
                    { !id_evaluation && question.validated == 1 ?
                    <Tooltip title="Aplicar questão em avaliaçãoo">
                        <IconButton
                            aria-label="copy"
                            onClick={handleChooseEvaluation}>
                            <PlaylistAdd />
                        </IconButton>
                    </Tooltip> : null }
                    { question.validated == 0 && question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                    <Tooltip title="Habilite a questão para aplicações">
                        <Switch
                            checked={question.validated}
                            onChange={onClickOpenDialogEnableQuestion}
                            color="primary"
                            name="checkedB"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                    </Tooltip> : null }
                    { question.validated == 0 && question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                        <Tooltip title="Editar Questão">
                            <IconButton
                                aria-label="copy"
                                onClick={onApplyQuestionInEvaluation}>
                                <Edit />
                            </IconButton>
                        </Tooltip> : null }
                    <Tooltip title="Opções">
                        <IconButton aria-label="settings"
                                    onClick={handleClick}>
                            <MoreVert />
                        </IconButton>
                    </Tooltip>
                </div>
            }
            title={
                question.id < 10 ? 'Questão - 00000' + question.id :
                    question.id < 100 ? 'Questão - 0000' + question.id :
                        question.id < 1000 ? 'Questão - 000' + question.id :
                            question.id < 10000 ? 'Questão - 00' + question.id :
                                question.id < 100000 ? 'Questão - 0' + question.id :
                                    question.id
            }
            subheader={'Curso de origem: '+question.course.description}/>
        <CardContent>
            <div>
            { question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                <Chip label="Inserida por você" className={clsx(classes.chipGreen, className)} size="small"/> : null}
            { question.validated == 1 ?
                <Chip label="Habilitada" className={clsx(classes.chipGreen, className)} size="small"/> : null}
            </div>
            <br />
            { question.reference != "" && question.reference != null ?
                <div>
                    <Typography variant="button" color="textSecondary" component="p">
                        Referência:
                    </Typography>
                    <div> { question.reference } </div>
                    <br />
                </div>
                : null}
            { question.profile.length != 0 ?
            <div>
                <Typography variant="button" color="textSecondary" component="p">
                Perfil:
                </Typography>
                <div> { question.profile.description } </div>
                <br />
            </div>
            : null}
            { question.skill.length != 0 ?
                <div>
                    <Typography variant="button" color="textSecondary" component="p">
                        Competência:
                    </Typography>
                    <div> { question.skill.description } </div>
                    <br />
                </div>
                : null}
            { question.knowledge_objects.length != 0 ?
                <div>
                    <Typography variant="button" color="textSecondary" component="p">
                        Objeto(s) de Conhecimento:
                    </Typography>
                    {question.knowledge_objects.map(item => (
                        <div> { ReactHtmlParser (item.description) } </div>
                    ))}
                    <br />
                </div>
                : null}

            <Typography variant="button" color="textSecondary" component="p">
            Texto base:
            </Typography>
            <br />
            <div> { ReactHtmlParser (question.base_text) } </div>
        </CardContent>
        <CardActions disableSpacing>
            <Tooltip title="Expandir a questão">
                <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreRounded />
                </IconButton>
            </Tooltip>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Typography variant="button" color="textSecondary" component="p">
                    Enunciado:
                </Typography>
                <br />
                <div> { ReactHtmlParser (question.stem) } </div>
                <br />
                <Typography variant="button" color="textSecondary" component="p">
                    Alternativas:
                </Typography>
                <br />
                {question.question_items.map(item => (
                    item.correct_item == 1 ?
                        <Paper className={clsx(classes.paper, classes.paperRight)} elevation={3} variant="outlined"> { ReactHtmlParser (item.description)  }</Paper>
                        : <Paper className={clsx(classes.paper, classes.paperWrong)} variant="outlined"> { ReactHtmlParser (item.description) } </Paper>
                ))}

            </CardContent>
        </Collapse>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            { !id_evaluation ? <MenuItem onClick={duplicateQuestion}>Duplicar</MenuItem> : null }
            {/* exclui de questão de avaliação */}
            { id_evaluation ? <MenuItem onClick={onClickOpenDialogQEvaluation}>Excluir da Avaliação</MenuItem> : null }
            {/* exclui de questão */}
            { !id_evaluation && question.validated == 0
                    && question.fk_user_id == localStorage.getItem("@Questione-id-user")
                ? <MenuItem onClick={onClickOpenDialogQuestion}>Excluir</MenuItem> : null }
        </Menu>
        <DialogQuestione handleClose={onClickCloseDialogQEvaluation}
                         open={openDeleteQuestionEvaluation}
                         onClickAgree={deleteQuestionEvaluation}
                         onClickDisagree={onClickCloseDialogQEvaluation}
                         mesage={'Deseja excluir a questão selecionada da avaliação?'}
                         title={'Excluir Questão da Avaliaçao'}/>
        <DialogQuestione handleClose={onClickCloseDialogQuestion}
                         open={openDeleteQuestion}
                         onClickAgree={deleteQuestion}
                         onClickDisagree={onClickCloseDialogQuestion}
                         mesage={'Deseja excluir a questão selecionada?'}
                         title={'Excluir Questão'}/>
        <DialogQuestione handleClose={onClickCloseDialogEnableQuestion}
                         open={openEnableQuestion}
                         onClickAgree={handleChangeValidated}
                         onClickDisagree={onClickCloseDialogEnableQuestion}
                         mesage={'Depois de habilitada, a questão não poderá ser excluída nem editada. Deseja habilitar?'}
                         title={'Habilitar Questão'}/>
        {/* Dialog de escolha da avaliação */}
        <Dialog fullScreen onClose={handleChooseEvaluationExit} aria-labelledby="simple-dialog-title" open={openEvalationChoose}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleChooseEvaluationExit} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        Selecione a avaliação para aplicar a questão
                    </Typography>
                </Toolbar>
            </AppBar>
            <List>
                {evaluations.map((evaluation) => (
                    <ListItem button onClick={() => handleListItemClick(evaluation)} key={evaluation.id}>
                        <ListItemText primary={"Descrição: "+evaluation.description}
                                      secondary={"Criada em: "+  moment(evaluation.created_at).format('DD/MM/YYYY')}/>
                    </ListItem>
                ))}
            </List>
        </Dialog>

    </Card>
  );
};

QuestionCard.propTypes = {
  className: PropTypes.string,
  question: PropTypes.object,
  id_evaluation: PropTypes.object,
  evaluations: PropTypes.object,
    history: PropTypes.object
};

export default withRouter(QuestionCard);
