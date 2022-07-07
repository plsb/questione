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
    List,
    Dialog, AppBar, Toolbar, Box
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import {MoreVert, PlaylistAdd, ExpandMoreRounded, Edit} from '@material-ui/icons';
import {withRouter} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from "../../services/api";
import {DialogQuestione} from "../index";
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';
import moment from "moment";
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';

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
    chipblue: {
        margin: 3,
        backgroundColor: '#2196f3',
        color: '#fff',
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
    colorLabelDifficulty: {
        color: '#3f51b5',
        fontSize: 16,
        fontWeight: 'bold'
    },
    colorLabelDifficultyWithoutAnswer:{
        color: '#f44336',
        fontSize: 16,
        fontWeight: 'bold'
    }
}));

const QuestionCard = props => {
  const { className, history, question, setRefresh, refresh, id_evaluation, ...rest } = props;

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
            if(response.status == 200) {
                setEvaluations(response.data);
            }
        } catch (error) {
            setEvaluations([]);
        }
    }

    async function loadRank(){
        try {
            let response = await api.get('/rank/by-user?fk_question_id='+question.id);
            //verifica se usuário já classificou
            let rank = 0;
            if(response.status == 200) {
                if (response.data.id) {
                    rank = response.data.rank;
                    setRankUserQuestion(response.data.rank);
                }
                if (rank > 0 || question.fk_user_id == localStorage.getItem("@Questione-id-user")) {
                    response = await api.get('/rank/by-question?fk_question_id=' + question.id);
                    rank = response.data[0].avg;
                    setQtRank(response.data[0].count);
                }
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
            let url = '/rank';

            const response = await api.post(url, data);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                } else if(response.data.errors[0].rank){
                    toast.error(response.data.errors[0].rank);
                } if(response.data.errors[0].fk_question_id){
                    toast.error(response.data.errors[0].fk_question_id);
                }
            } else {
                toast.success('Classificação cadastrada.');
            }
        } catch (error) {
            setEvaluations([]);
        }
    }

   /* function loadRank(){

        if(question.rank_avg.length !== 0){
            setRank(question.rank_avg[0].rank_avg);
        }
        if(question.rank_by_user_active.length == 0 &&
            question.fk_user_id !== localStorage.getItem("@Questione-id-user")) {
            setRank(0)
        }
        setQtRank(question.rank_count);
    }*/

    useEffect(() => {
        loadRank();
    }, [question, rank]);

    useEffect(() => {

    }, [rank]);

    useEffect(() => {

    }, [openDeleteQuestionEvaluation]);

    useEffect(() => {
        loadRank();
        loadEvaluations();

    }, []);

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
        setOpenDeleteQuestion(false);
        try {
            let url = 'question/'+question.id;

            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão excluída.');
                setRefresh(refresh+1);
            }
            handleClose();
        } catch (error) {

        }
    }

    async function deleteQuestionEvaluation() {
        setOpenDeleteQuestionEvaluation(false);
        try {
            let url = 'evaluation/deletequestion/'+question.id+'+?fk_evaluation_id='+id_evaluation;
            const fk_evaluation_id = id_evaluation;
            const data = {
                fk_evaluation_id
            }
            const response = await api.delete(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão excluída da avaliação.');
                setRefresh(refresh+1);
            }

            handleClose();
        } catch (error) {

        }
    }

    const onEditQuestion = (id) => {
        history.push('/question-details/' + id);
    }

    async function handleChangeValidated() {
        if(question.validated == 1){
            toast.error('Uma questão que já foi habilitada não pode ser desabilitada.');
            return ;
        }
        try {
            let url = 'question/validate/'+question.id;
            const response = await api.put(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão habilitada.');
                setRefresh(refresh+1);
            }
        } catch (error) {

        }
        setOpenEnableQuestion(false);
    }

    async function duplicateQuestion() {
        try {
            let url = 'question/duplicate/'+question.id;
            const response = await api.post(url);
            if (response.status === 202) {
                if(response.data.message){
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão duplicada.');
                setRefresh(refresh+1);
            }

            handleClose();
        } catch (error) {

        }
    }

    const [openEvalationChoose, setOpenEvalationChoose] = React.useState(false);

    const handleChooseEvaluation = () => {
        if(question.fk_user_id !== parseInt(localStorage.getItem("@Questione-id-user")) && rank == 0){
            toast.error('Antes de aplicar a questão, você deve avaliá-la escolhendo de 1 a 5 estrelas.')
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
                    toast.error(response.data.message);
                }
            } else {
                toast.success('Questão adicionada na avaliação.');
            }
        } catch (error) {

        }

        setOpenEvalationChoose(false);

    }

    const difficulty = (porc, totalCorrect) => {
        if(totalCorrect < 20){
            return ""
        }
        if (porc >= 0.86) {
            return 'Muito Fácil'
        } else if(porc >= 0.61 && porc <= 0.85){
            return 'Fácil'
        } else if(porc >= 0.41 && porc <= 0.60){
            return 'Média'
        } else if(porc >= 0.16 && porc <= 0.40){
            return 'Difícil'
        } else if(porc <= 0.15){
            return 'Muito Difícil'
        }
        return '';
    }

  return (
      <div className={classes.content}>
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
                                { question.skill !== null && question.knowledge_objects[0] &&
                                question.question_items.length >= 2 && question.course  !== null
                                    ?
                                    <Tooltip title="Esta questão é completa. Possui texto-base, enunciado,
                                            pelo menos duas alternativas,
                                            um curso associado, uma competência associada e pelo menos um
                                            objeto de conhecimento associado.">
                                        <AssignmentTurnedIn
                                            color="secondary"
                                            fontSize="small"/>

                                    </Tooltip>
                                    :
                                    null }
                            </Typography>
                            { question.course  !== null ?
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
                            <div>
                                { question.difficulty.total_answers == 0 ?
                                    <p className={clsx(classes.colorLabelDifficultyWithoutAnswer)}>
                                        {"Esta questão ainda não foi respondida em uma avaliação."}
                                    </p>
                                    :
                                    <p className={clsx(classes.colorLabelDifficulty)}>
                                        { question.difficulty.total_answers == 1 ?
                                            "Esta questão só foi respondida "+question.difficulty.total_answers
                                            +" vez."
                                            :
                                            "Das avaliações aplicadas, "+Math.round(question.difficulty.porc_correct*100)+ "% das "
                                            +" respostas para esta questão foram corretas."}
                                    </p>
                                }
                            </div>
                            <div>
                                { question.difficulty.total_answers > 20 ?
                                    <p className={clsx(classes.colorLabelDifficulty)}>
                                        {'Dificuldade: '+difficulty(question.difficulty.porc_correct,
                                                    question.difficulty.total_answers)+'.'}
                                    </p>
                                    :
                                    <p className={clsx(classes.colorLabelDifficultyWithoutAnswer)}>
                                    {"Não foi possível calcular a dificuldade."}
                                    </p>
                                }


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
                                { question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
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
                                    {parseInt(question.fk_user_id) != parseInt(localStorage.getItem("@Questione-id-user")) && parseInt(rank) == 0 ?
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
                                                { rank > 0 ?  'Média: ' + rank + ' estrela(s).' : null}
                                            </Typography>
                                            <Typography className={classes.labelRank} variant="caption" color="textSecondary" component="p">
                                                { rankUserQuestion > 0 ?  'Sua classificação: ' + rankUserQuestion + ' estrela(s).' : ''}
                                            </Typography>
                                        </div> }

                                </Tooltip>
                            </Box>
                        </div>
                    }/>
                <CardContent>
                    <div className={classes.lineQuestion}>

                         { question.year !== '' && question.year !== null ?
                            <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                    Ano:
                                </Typography>
                                <div> { question.year }
                                    { question.fk_type_of_evaluation_id !== '' && question.fk_type_of_evaluation_id !== null ?
                                              ' - '+question.type_of_evaluation.description
                                        : null}
                                </div>

                                <br />
                            </div>
                            : null}
                        { question.skill  !== null ?
                            <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                    Competência:
                                </Typography>
                                <div> { question.skill.description } </div>
                                <br />
                            </div>
                            : null}
                        { question.knowledge_objects[0] ?
                            <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                    Objeto(s) de conhecimento:
                                </Typography>
                                {question.knowledge_objects.map(item => (
                                    <div> { ReactHtmlParser (item.description) } </div>
                                ))}
                                <br />
                            </div>
                            : null}

                        { question.keywords[0] ?
                            <div>
                                <Typography variant="button" color="textSecondary" component="p">
                                    Palavra(s)-chave:
                                </Typography>
                                {question.keywords.map(item => (
                                      ReactHtmlParser (item.keyword) + '; '
                                ))}
                                <br /> <br />
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
                                 mesage={'Depois de habilitada, a questão não poderá ser deletada e não poderá sofrer mudanças no texto base, enunciado e alternativas. Deseja habilitar?'}
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
                                <ListItemText
                                    primary={"Descrição: "+evaluation.description}
                                    secondary={(
                                        <div>
                                            <p>{"Criada em: "+  moment(evaluation.created_at).format('DD/MM/YYYY')}</p>
                                            {evaluation.class && (
                                                <Chip label={evaluation.class.description} className={clsx(classes.chipblue, className)} size="small"/>
                                            )}
                                        </div>
                                    )}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>

            </Card>
      </div>
  );
};

QuestionCard.propTypes = {
    className: PropTypes.string,
    question: PropTypes.object,
    id_evaluation: PropTypes.object,
    evaluations: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number,

};

export default withRouter(QuestionCard);
