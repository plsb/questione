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
    Dialog, Avatar, AppBar, Toolbar, Box
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
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
    marginTop: 5,
    marginBottom: 10,
      marginRigth: 0,
      marginLeft: 5,
      width: '100%'
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
    chipRed:{
        backgroundColor: '#f44336',
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
        margin: 3,
        padding: 8
    },
    paperRight: {
        backgroundColor: '#80cbc4',
        color: '#212121',
        margin: 3,
        padding: 8
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
    labelRank: {
      textAlign: 'right'
    },
    lineQuestion: {
        marginLeft: 20,
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
    const [rank, setRank] = React.useState(0);
    const [qtRank, setQtRank] = React.useState(0);
    //constante definirá nota de classificação para a questão
    const [rankUserQuestion, setRankUserQuestion] = React.useState(0);

  const classes = useStyles();

    async function loadEvaluations(){
        try {
            let url = '/evaluation/choose';

            const response = await api.get(url);
            setEvaluations(response.data);
        } catch (error) {
            setEvaluations([]);
        }
    }

    async function loadRank(){
        try {
            let response = await api.get('/rank/by-user?fk_question_id='+question.id);
            //verifica se usuário já classificou
            let rank = 0;
            if(response.data.id){
                rank = response.data.rank;
                setRankUserQuestion(response.data.rank);
            }
            if(rank > 0 || question.fk_user_id == localStorage.getItem("@Questione-id-user")){
                response = await api.get('/rank/by-question?fk_question_id='+question.id);
                rank = response.data[0].avg;
                setQtRank(response.data[0].count);
            }
            setRank(rank);

        } catch (error) {

        }
    }

    async function modifyRank(rank){
        setRank(rank);
        try {
            const fk_question_id = question.id;
            const data = {
                fk_question_id,
                rank
            }
            let url = '/rank/';

            const response = await api.post(url, data);
            if (response.status === 202) {
                if(response.data.message){
                    loadAlert('error', response.data.message);
                } else if(response.data.errors[0].rank){
                    loadAlert('error', response.data.errors[0].rank);
                } if(response.data.errors[0].fk_question_id){
                    loadAlert('error', response.data.errors[0].fk_question_id);
                }
            } else {
                loadAlert('success', 'Classificação cadastrada.');
            }
        } catch (error) {
            setEvaluations([]);
        }
    }

   /* function loadRank(){
        console.log('passou rank');
        if(question.rank_avg.length != 0){
            setRank(question.rank_avg[0].rank_avg);
        }
        if(question.rank_by_user_active.length == 0 &&
            question.fk_user_id != localStorage.getItem("@Questione-id-user")) {
            setRank(0)
        }
        setQtRank(question.rank_count);
    }*/

    useEffect(() => {
        loadRank();
    }, [question, rank]);

    useEffect(() => {
        loadRank();
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

    const onEditQuestion = (id) => {
        history.push('/question-details/'+id);
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
        if(question.fk_user_id != localStorage.getItem("@Questione-id-user") && rank == 0){
            loadAlert('error', 'Antes de aplicar a questão, você deve classificá-la.')
            return;
        }
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

    }

  return (
    <Card
      {...rest}
      className={classes.root}>
        <CardHeader
            avatar={
                <div>
                    <Typography variant="h5" color="textSecondary" component="h2">
                        {
                            question.id < 10 ? 'Questão - 00000' + question.id :
                                question.id < 100 ? 'Questão - 0000' + question.id :
                                    question.id < 1000 ? 'Questão - 000' + question.id :
                                        question.id < 10000 ? 'Questão - 00' + question.id :
                                            question.id < 100000 ? 'Questão - 0' + question.id :
                                                question.id
                        }
                    </Typography>
                    { question.course  != null ?
                    <Typography variant="button" color="textSecondary" component="h2">
                        {'Área de origem: '+question.course.description}
                    </Typography> : null }
                    <div>
                        { question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                            <Chip label="Inserida por você" className={clsx(classes.chipGreen, className)} size="small"/> : null}
                        { question.validated == 1 ?
                            <Chip label="Ativa" className={clsx(classes.chipGreen, className)} size="small"/> :
                            <Chip label="Inativa" className={clsx(classes.chipRed, className)} size="small"/>}
                    </div>

                </div>
            }
            action={
                <div>
                    <Box display="flex" justifyContent="flex-end" p={1} m={1} bgcolor="background.paper">
                        { !id_evaluation && question.validated == 1 ?
                        <Tooltip title="Aplicar questão em avaliação">
                            <IconButton
                                className={classes.labelRank}
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
                                <IconButton className={classes.labelRank}
                                    aria-label="copy"
                                    onClick={() => onEditQuestion(question.id)}>
                                    <Edit />
                                </IconButton>
                            </Tooltip> : null }
                        <Tooltip title="Opções">
                            <Box flexDirection="row" alignSelf="flex-end">
                                <IconButton className={classes.labelRank} aria-label="settings"
                                            onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    </Box>
                    <Box display="flex" flexDirection="flex-end" p={1} m={1}>
                        <Tooltip title="Avaliação da questão">
                            {question.fk_user_id != localStorage.getItem("@Questione-id-user") && rank == 0 ?
                                <div>
                                    <Rating
                                        name={question.id}
                                        value={rank}
                                        onChange={(event, newValue) => {
                                            modifyRank(newValue);
                                        }}/>

                                </div>   :
                                <div>
                                    <Rating
                                        name="simple-controlled"
                                        value={rank}
                                        precision={1} disabled/>
                                    <Typography className={classes.labelRank} variant="caption" color="textSecondary" component="p">
                                        { qtRank < 2 ?  qtRank + ' Classificação.' : qtRank + ' Classificações.'}
                                    </Typography>
                                    <Typography className={classes.labelRank} variant="caption" color="textSecondary" component="p">
                                        { rankUserQuestion > 0 ?  'Sua classificação: ' + rankUserQuestion + '.' : ''}
                                    </Typography>
                                </div> }

                        </Tooltip>
                    </Box>
                </div>
            }/>
        <CardContent>
            <div className={classes.lineQuestion}>
                { question.reference != "" && question.reference != null ?
                    <div>
                        <Typography variant="button" color="textSecondary" component="p">
                            Referência:
                        </Typography>
                        <div> { question.reference } </div>
                        <br />
                    </div>
                    : null}
                { question.skill  != null ?
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
            </div>
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
            <CardContent className={classes.lineQuestion}>
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
