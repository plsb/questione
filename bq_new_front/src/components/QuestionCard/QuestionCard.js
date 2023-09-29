import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Card,
    IconButton,
    MenuItem, Menu,
    CardContent,
    Tooltip,
    Paper,
    Switch, ListItem, ListItemText,
    List,
    Dialog, AppBar, Toolbar, Box, Divider, Link, CardActionArea, FormControlLabel, Hidden
} from '@material-ui/core';
import {MoreVert, PlaylistAdd, ExpandMoreRounded, Edit} from '@material-ui/icons';
import {withRouter} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import api from "../../services/api";
import {DialogQuestione} from "../index";
import moment from "moment";
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';
import QuestionText from "../QuestionText";
import useStyles from "../../style/style";
import {FormGroup} from "reactstrap";
import DecreaseStringSize from "../DecreaseStringSize";
import TooltipQuestione from "../TooltipQuestione";
import InfoIcon from '@material-ui/icons/Info';

const useStylesLocal = makeStyles(theme => ({
    root: {

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
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    appBar: {
        position: 'relative',
        background: '#3a7cf7',
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
  const { className, history, question, setRefresh, refresh, id_evaluation, id_course, ...rest } = props;

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
    const [alternativeLetters] = React.useState(['a', 'b', 'c', 'd', 'e']);
    const [difficultyList] = React.useState(['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil']);

  const classes = useStylesLocal();
  const classesGeneral = useStyles();

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

    useEffect(() => {

    }, [anchorEl]);

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
        setAnchorEl(null);
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
        /*if(question.fk_user_id !== parseInt(localStorage.getItem("@Questione-id-user")) && rank == 0){
            toast.error('Antes de aplicar a questão, você deve avaliá-la escolhendo de 1 a 5 estrelas.')
            return;
        }*/
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
                <Paper className={classesGeneral.paperTitle}>
                    <Box display="flex">
                        <Box display="flex" sx={{ flexGrow: 1 }} justifyContent="flex-start">
                            <div className={classesGeneral.paperTitleText}>
                                {
                                    question.id < 10 ? 'Q00000' + question.id :
                                        question.id < 100 ? 'Q0000' + question.id :
                                            question.id < 1000 ? 'Q000' + question.id :
                                                question.id < 10000 ? 'Q00' + question.id :
                                                    question.id < 100000 ? 'Q0' + question.id :
                                                        question.id
                                }
                            </div>
                            {question.course &&
                                    <Box display="flex">
                                        { id_course != 0 && id_course != question.fk_course_id ?
                                            <TooltipQuestione description={'Área relacionada é uma área que é diferente da área da busca realizada, mas seus conteúdos estão relacionados.'} position={'bottom'} content={
                                                <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                                    <DecreaseStringSize string= {'Área '}/>
                                                    <InfoIcon style={{fontSize: '14px'}}/>
                                                    {': '}
                                                </div>
                                            }/>
                                            :
                                        <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                            {'Área: '}
                                        </div> }
                                        <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                            <TooltipQuestione description={question.course.description} position={'bottom'} content={
                                                <DecreaseStringSize string={question.course.description} large={0.8}/>
                                            }/>
                                        </div>
                                    </Box>
                            }
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            { !id_evaluation && question.validated == 1 ?
                                <TooltipQuestione description="Clique para aplicar a questão em avaliação" position={"top-start"} content={
                                    <IconButton
                                        className={classes.labelRank}
                                        aria-label="copy"
                                        onClick={handleChooseEvaluation}
                                        size="small"
                                        style={{marginLeft: '10px'}}>
                                        <PlaylistAdd />
                                    </IconButton>
                                }/> : null }
                            { question.validated == 0 && question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                                <Tooltip title="Habilite a questão para aplicações">
                                    <FormGroup>
                                        <FormControlLabel control={
                                            <Switch
                                                checked={question.validated}
                                                onChange={onClickOpenDialogEnableQuestion}
                                                color="primary"
                                                name="checkedB"
                                                size="small"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        } label="Habilitar a questão" />
                                    </FormGroup>

                                </Tooltip> : null }
                            { question.fk_user_id == localStorage.getItem("@Questione-id-user") ?
                                <TooltipQuestione description={"Editar Questão"} position={"top-start"} content={
                                    <IconButton className={classes.labelRank}
                                                aria-label="copy"
                                                onClick={() => onEditQuestion(question.id)}
                                                size="small"
                                                style={{marginLeft: '10px'}}>
                                        <Edit />
                                    </IconButton>
                                }/> : null }
                            <TooltipQuestione description={"Clique para visualizar mais opções da questão"} position={"top-start"} content={
                                <Box flexDirection="row" alignSelf="flex-end">
                                    <IconButton className={classes.labelRank} aria-label="settings"
                                                onClick={handleClick}
                                                size="small"
                                                style={{marginLeft: '10px'}}>
                                        <MoreVert />
                                    </IconButton>
                                </Box>
                            }/>
                        </Box>
                    </Box>

                </Paper>
                <Paper className={classesGeneral.paperSubtitle}>
                    <Box display="flex">
                        <Hidden xsDown>
                            <TooltipQuestione description={"Ano em que a questão foi criada."} position={"top-start"} content={
                                <div>{question.year !== '' && question.year !== null ?
                                    <div className={classesGeneral.paperTitleText}>
                                        {"Ano: " +question.year}
                                    </div>
                                : <div className={classesGeneral.paperTitleText}>
                                        {"Ano: " +moment(question.created_at).format('YYYY')}
                                    </div> }</div>
                            }/>
                        </Hidden>
                        <Hidden xsDown>
                            { question.fk_type_of_evaluation_id !== '' && question.fk_type_of_evaluation_id !== null &&
                                <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                    {'Banca: '+question.type_of_evaluation.description}
                                </div>
                            }
                        </Hidden>
                        <Hidden xsDown>
                            { question.initial_difficulty !== null &&
                                <Box display="flex">
                                    <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                        {'Dificuldade: '}
                                    </div>
                                    <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                        {difficultyList[question.initial_difficulty-1]}
                                    </div>
                                </Box>
                            }
                        </Hidden>
                        { question.knowledge_objects[0] &&
                            <Box display="flex">
                                <div className={classesGeneral.paperTitleText} style={{marginLeft: '15px'}}>
                                    {'Conteúdo(s):'}
                                </div>
                                <div className={classesGeneral.paperTitleTextBold} style={{marginLeft: '5px'}}>
                                    {question.knowledge_objects.map(item => (
                                        ReactHtmlParser (item.description)+'. '
                                        ))}
                                </div>
                            </Box>

                        }

                    </Box>

                </Paper>
                <CardContent>
                    <QuestionText question={question}/>
                </CardContent>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    { !id_evaluation ?
                        <MenuItem onClick={duplicateQuestion}>
                            <div className={classesGeneral.itensMenu}>{'Duplicar'}</div>
                        </MenuItem> : null }
                    {/* exclui de questão de avaliação */}
                    { id_evaluation ?
                        <MenuItem onClick={onClickOpenDialogQEvaluation}>
                            <div  className={classesGeneral.itensMenu}>{'Excluir da Avaliação'}</div>
                        </MenuItem> : null }
                    {/* exclui de questão */}
                    { !id_evaluation && question.validated == 0
                            && question.fk_user_id == localStorage.getItem("@Questione-id-user")
                        ? <MenuItem onClick={onClickOpenDialogQuestion}> <div  className={classesGeneral.itensMenu}>{'Excluir'}</div></MenuItem> : null }
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
                                 mesage={
                                     <div className={classesGeneral.messageDialog}>
                                        {'Deseja excluir a questão Q'+question.id+'?'}
                                     </div>}
                                 title={
                                    <div className={classesGeneral.titleDialog}>
                                        {'Excluir Questão'}
                                    </div>}/>
                <DialogQuestione handleClose={onClickCloseDialogEnableQuestion}
                                 open={openEnableQuestion}
                                 onClickAgree={handleChangeValidated}
                                 onClickDisagree={onClickCloseDialogEnableQuestion}
                                 mesage={
                                     <div className={classesGeneral.messageDialog}>
                                         {'Depois de habilitada, a questão não poderá ser deletada e não poderá sofrer mudanças no texto base, enunciado e alternativas. Após habilitada, a questão poderá ser encontrada na opção Suas questões ou Todas as questoes. Deseja habilitar?'}
                                     </div>}
                                 title={
                                     <div className={classesGeneral.titleDialog}>
                                         {'Habilitar Questão'}
                                     </div>}/>
                {/* Dialog de escolha da avaliação */}
                <Dialog fullScreen onClose={handleChooseEvaluationExit} aria-labelledby="simple-dialog-title" open={openEvalationChoose}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleChooseEvaluationExit} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                            <div className={classesGeneral.titleList} style={{color: '#FFF', marginBottom: '15px'}}>
                                Selecione a avaliação para aplicar a questão
                            </div>
                        </Toolbar>
                    </AppBar>
                    <List>
                        {evaluations.map((evaluation) => (
                            <ListItem button onClick={() => handleListItemClick(evaluation)} key={evaluation.id}>
                                <ListItemText
                                    primary={
                                        <div className={classesGeneral.paperTitleText} style={{marginBottom: '15px', fontSize: '16px'}}>
                                            {"Descrição: "+evaluation.description}
                                        </div>}
                                    secondary={(
                                        <div>
                                            <div className={classesGeneral.paperTitleText} style={{fontSize: '12px'}}>
                                                {"Criada em: "+  moment(evaluation.created_at).format('DD/MM/YYYY')}
                                            </div>
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
    id_course: PropTypes.object,
    evaluations: PropTypes.object,
    history: PropTypes.object,
    setRefresh: PropTypes.func,
    refresh: PropTypes.number,

};

export default withRouter(QuestionCard);
